import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./routes/routes.js";

const app = express();

const port = 8000;

app.use(cors());
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(routes);

app.get("/", (req, res) => {
  res.json({ status: "API is running on /" });
});

app.use((err, req, res, next) => {
  if (err.message) {
    res.status(400).json({ error: err.message });
  } else if (err && err.errorCode) {
    res.status(err.errorCode).json(err.message);
  } else if (err) {
    res.status(500).json(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
