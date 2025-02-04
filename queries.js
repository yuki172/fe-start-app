require("dotenv").config();
const { v4: uuidv4 } = require("uuid");
const { getTaskFromIndex, getTaskIDFromIndex } = require("./data");

const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: "feeds",
  password: process.env.DB_PASSWORD,
  port: 5432,
});

const createFeed = (req, res) => {
  const feedID = uuidv4();
  const { task_count: taskCount = 50, candidate_name: candidateName = "" } =
    req.body;

  pool.query(
    "INSERT INTO feeds (feed_id, candidate_name, tasks_remaining, total_tasks) VALUES ($1, $2, $3, $4)",
    [feedID, candidateName, taskCount, taskCount],
    (error, results) => {
      if (error) {
        res.status(400).json({ error: "Failed to create feed." });
      } else {
        res.status(201).send(`Feed added with ID: ${feedID}`);
      }
    }
  );
};

const getNextTask = (req, res) => {
  const { feed_id: feedID } = req.params;

  pool.query(
    "SELECT tasks_remaining, total_tasks FROM feeds WHERE feed_id = $1",
    [feedID],
    (error, results) => {
      if (error) {
        res.status(400).json({ error: "Feed does not exist" });
      } else {
        const row = results.rows[0];
        const { tasks_remaining: tasksRemaining, total_tasks: totalTasks } =
          row;
        if (tasksRemaining === 0) {
          res.json({ tasks: [] });
        } else {
          const taskIndex = totalTasks - tasksRemaining;
          res.json({ tasks: [getTaskFromIndex({ taskIndex, feedID })] });
        }
      }
    }
  );
};

const getIsValidJudgmentID = ({ judgmentID }) => {
  if (judgmentID === "allow" || judgmentID === "deny") {
    return true;
  } else {
    return false;
  }
};
const reviewTask = (req, res) => {
  const {
    feed_id: feedID,
    task_id: taskID,
    judgment_id: judgmentID,
  } = req.body;

  if (!getIsValidJudgmentID({ judgmentID })) {
    res.status(400).json({ error: "The judgment_id is invalid." });
    return;
  }
  pool.query(
    "SELECT tasks_remaining, total_tasks FROM feeds WHERE feed_id = $1",
    [feedID],
    (error, results) => {
      if (error) {
        res.status(400).json({ error: "Feed does not exist" });
      } else {
        const row = results.rows[0];
        const { tasks_remaining: tasksRemaining, total_tasks: totalTasks } =
          row;

        const currentTaskIndex = totalTasks - tasksRemaining;
        const currentTaskID = getTaskIDFromIndex({ index: currentTaskIndex });
        if (currentTaskID != taskID) {
          res.status(400).send({ error: "Task does not exist in the feed." });
        } else {
          pool.query(
            "UPDATE feeds SET tasks_remaining = $1 WHERE feed_id = $2",
            [tasksRemaining - 1, feedID],
            (error, results) => {
              if (error) {
                res.status(400).json({ error: "Review failed" });
              } else {
                res.json({ message: "Task has been reviewed." });
              }
            }
          );
        }
      }
    }
  );
};

module.exports = {
  createFeed,
  getNextTask,
  reviewTask,
};
