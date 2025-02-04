require("dotenv").config();
const { v4: uuidv4 } = require("uuid");

const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: "feeds",
  password: process.env.DB_PASSWORD,
  port: 5432,
});

const createFeed = (req, res) => {
  const { username } = req.params;
  const feedID = uuidv4();
  const { task_count: taskCount = 50 } = req.body;

  pool.query(
    "INSERT INTO feeds (feed_id, username, tasks_remaining) VALUES ($1, $2, $3)",
    [feedID, username, taskCount],
    (error, results) => {
      if (error) {
        res.status(400).send(error.message);
      } else {
        res.status(201).send(`Feed added with ID: ${feedID}`);
      }
    }
  );
};

module.exports = {
  createFeed,
};
