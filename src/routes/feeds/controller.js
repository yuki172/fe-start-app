import { Router } from "express";
import {
  createFeed,
  getFeed,
  updateFeedTaskCounts,
  updateTaskExpireTime,
} from "./service.js";
import { getTaskIDFromIndex, getTaskFromIndex } from "../../mock_data.js";
import { v4 as uuidv4 } from "uuid";
import {
  getIsValidJudgmentID,
  getIsExpired,
  getExpireTime,
  getIsValidExpireInTime,
  TASK_EXPIRE_IN_DEFAULT,
} from "./utils.js";

const router = Router();

router.post("/feeds/create", async (req, res, next) => {
  const feedID = uuidv4();
  const {
    task_count: taskCount = 50,
    candidate_name: candidateName = "",
    task_expires_in: expireInTime = TASK_EXPIRE_IN_DEFAULT,
  } = req.body;

  if (taskCount <= 0) {
    res
      .status(400)
      .json({ message: "The task count needs to be greater than zero." });
    return;
  }

  if (!getIsValidExpireInTime(expireInTime)) {
    res.status(400).json({
      message: "Expire time needs to be >= 30 seconds and <= 600 seconds",
    });
    return;
  }

  try {
    await createFeed({ feedID, taskCount, candidateName, expireInTime });
    res.status(201).json({ message: "Feed added", feed_id: feedID });
  } catch (error) {
    next(error);
  }
});

router.get("/feeds/:feed_id/nextTask", async (req, res, next) => {
  const { feed_id: feedID } = req.params;

  try {
    const feedQueryResult = await getFeed({ feedID });
    const feed = feedQueryResult.rows[0];
    if (feed == null) {
      throw { message: "Feed not found" };
    }
    const {
      tasks_remaining: tasksRemaining,
      total_tasks: totalTasks,
      task_expires_in: expireInTime,
    } = feed;

    const expireTimeStr = getExpireTime({ expireInTime }).toISOString();
    await updateTaskExpireTime({
      feedID,
      expireTimeStr,
    });

    if (tasksRemaining === 0) {
      res.json({ tasks: [] });
    } else {
      const taskIndex = totalTasks - tasksRemaining;
      res.json({
        tasks: [getTaskFromIndex({ taskIndex, feedID })],
        expire_time: expireTimeStr,
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
    const {
      tasks_remaining: tasksRemaining,
      total_tasks: totalTasks,
      expire_time: expireTime,
    } = feed;
    const currentTaskIndex = totalTasks - tasksRemaining;
    const currentTaskID = getTaskIDFromIndex({ index: currentTaskIndex });
    if (currentTaskID !== taskID) {
      res.status(400).send({
        error: "Task does not exist in the feed or has not been checked out.",
      });
    } else {
      if (getIsExpired({ expireTime })) {
        throw { message: "Task has expired." };
      }
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
