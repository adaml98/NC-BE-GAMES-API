const express = require("express");
const {
  getCategories,
  getReview,
} = require("./controllers/categories.controllers");

const app = express();

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReview);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.code === "42703") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
