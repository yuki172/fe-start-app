import { Router } from "express";
import {
  createFeed,
  getNextTask,
  getFeed,
  updateFeedTaskCounts,
} from "./service.js";
import { getTaskIDFromIndex, getTaskFromIndex } from "../../mock_data.js";
import { v4 as uuidv4 } from "uuid";
import { getIsValidJudgmentID } from "./utils.js";

const router = Router();

router.post("/feeds/create", async (req, res, next) => {
  const feedID = uuidv4();
  const { task_count: taskCount = 50, candidate_name: candidateName = "" } =
    req.body;

  try {
    await createFeed({ feedID, taskCount, candidateName });
    res.status(201).json({ message: "Feed added", feed_id: feedID });
  } catch (error) {
    next(error);
  }
});

router.get("/feeds/:feed_id/nextTask", async (req, res, next) => {
  const { feed_id: feedID } = req.params;

  try {
    const result = await getNextTask({ feedID });
    const feed = result.rows[0];
    if (feed == null) {
      throw { message: "Feed not found" };
    }
    const { tasks_remaining: tasksRemaining, total_tasks: totalTasks } = feed;
    if (tasksRemaining === 0) {
      res.json({ tasks: [] });
    } else {
      const taskIndex = totalTasks - tasksRemaining;
      res.json({
        tasks: [getTaskFromIndex({ taskIndex, feedID })],
      });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/feeds/:feed_id/submitJudgment", async (req, res, next) => {
  const { feed_id: feedID } = req.params;
  const { task_id: taskID, judgment_id: judgmentID } = req.body;

  if (!getIsValidJudgmentID({ judgmentID })) {
    res.status(400).json({ error: "The judgment_id is invalid." });
    return;
  }
  try {
    const feedQueryResult = await getFeed({ feedID });
    const feed = feedQueryResult.rows[0];
    if (feed == null) {
      throw { message: "Feed not found" };
    }
    const { tasks_remaining: tasksRemaining, total_tasks: totalTasks } = feed;

    const currentTaskIndex = totalTasks - tasksRemaining;
    const currentTaskID = getTaskIDFromIndex({ index: currentTaskIndex });
    if (currentTaskID !== taskID) {
      res.status(400).send({ error: "Task does not exist in the feed." });
    } else {
      const updatedTasksRemaining = tasksRemaining - 1;
      await updateFeedTaskCounts({
        tasksRemaining: updatedTasksRemaining,
        feedID,
      });
      res.json({
        message: "Task has been reviewed.",
        tasks_remaining: updatedTasksRemaining,
      });
    }
  } catch (error) {
    next(error);
  }
});

export default router;
