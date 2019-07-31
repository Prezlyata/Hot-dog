const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Task = require("./models/task");
const app = express();

app.use(bodyParser.json(), cors());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 5000;
const SERVER = "127.0.0.1:27017";
const DB = "tasks-app";
const MONGODB_URI = `mongodb://${SERVER}/${DB}`;
const connection = mongoose.connection;
const option = {
  socketTimeoutMS: 30000,
  keepAlive: true,
  reconnectTries: 30000
};

mongoose.Promise = Promise;
mongoose.connect(
  MONGODB_URI,
  option
);

connection.on("connected", () => console.log("Connected to database"));
connection.on("error", err => console.log("Connection failed with - ", err));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

app.get("/tasks", (req, res, next) => {
  Task.find((err, tasks) => {
    if (err) return next(err);
    res.json(tasks);
  });
});

app.post("/tasks", (req, res, next) => {
  Task.create(req.body, (err, task) => {
    if (err) return next(err);
    res.json(task);
  });
});

app.delete("/tasks:id", function(req, res, next) {
  Task.findByIdAndRemove(req.params.id.substr(1), req.body, (err, post) => {
    if (err) return next(err);
    res.json(post);
  });
});
