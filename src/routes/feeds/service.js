import { pool } from "../../postgres/client.js";

export const createFeed = async ({
  feedID,
  taskCount,
  candidateName,
  expireInTime,
}) => {
  const result = await pool.query(
    "INSERT INTO feeds (feed_id, candidate_name, tasks_remaining, total_tasks, task_expires_in) VALUES ($1, $2, $3, $4, $5)",
    [feedID, candidateName, taskCount, taskCount, expireInTime]
  );
  return result;
};

export const getFeed = async ({ feedID }) => {
  const result = await pool.query("SELECT * FROM feeds WHERE feed_id = $1", [
    feedID,
  ]);
  return result;
};

export const updateFeedTaskCounts = async ({ tasksRemaining, feedID }) => {
  const result = await pool.query(
    "UPDATE feeds SET tasks_remaining = $1 WHERE feed_id = $2",
    [tasksRemaining, feedID]
  );
  return result;
};

export const updateTaskExpireTime = async ({ feedID, expireTimeStr }) => {
  const result = await pool.query(
    "UPDATE feeds SET expire_time = $1 WHERE feed_id = $2",
    [expireTimeStr, feedID]
  );
  return result;
};
