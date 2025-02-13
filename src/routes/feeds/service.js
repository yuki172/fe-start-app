import { pool } from "../../postgres/client.js";

export const createFeed = async ({ feedID, taskCount, candidateName }) => {
  const result = await pool.query(
    "INSERT INTO feeds (feed_id, candidate_name, tasks_remaining, total_tasks) VALUES ($1, $2, $3, $4)",
    [feedID, candidateName, taskCount, taskCount]
  );
  return result;
};

export const getFeed = async ({ feedID }) => {
  const result = await pool.query(
    "SELECT tasks_remaining, total_tasks FROM feeds WHERE feed_id = $1",
    [feedID]
  );
  return result;
};

export const updateFeedTaskCounts = async ({ tasksRemaining, feedID }) => {
  const result = await pool.query(
    "UPDATE feeds SET tasks_remaining = $1 WHERE feed_id = $2",
    [tasksRemaining, feedID]
  );
  return result;
};

export const getNextTask = async ({ feedID }) => {
  const result = await pool.query(
    "SELECT tasks_remaining, total_tasks FROM feeds WHERE feed_id = $1",
    [feedID]
  );
  return result;
};
