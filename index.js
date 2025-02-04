const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const { createFeed } = require("./queries");

const port = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).send("Internal Server Error");
});

app.get("/:name", (req, res, next) => {
  console.log("in route", req.params);
  res.send("hello apple");
});

app.post("/:username/createFeed", createFeed);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
