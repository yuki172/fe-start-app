const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { createFeed, getNextTask, reviewTask } = require("./queries");

const port = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.post("/feeds/create", createFeed);
app.get("/feeds/:feed_id/nextTask", getNextTask);
app.post("/feeds/submitJudgment", reviewTask);

app.use((error, req, res, next) => {
  console.log("error occurred", { error });
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
