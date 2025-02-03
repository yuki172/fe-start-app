const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");

const port = 8000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

app.get("/:name", (req, res, next) => {
  console.log("in route", req.params);
  res.send("hello apple");
});
