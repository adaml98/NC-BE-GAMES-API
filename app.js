const express = require("express");
const {
  getCategories,
  getReview,
  getReviews,
  getReviewComments,
  patchReview,
} = require("./controllers/categories.controllers");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReview);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getReviewComments);

app.patch("/api/reviews/:review_id", patchReview);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  if (err.code === "42703" || err.code === "22P02") {
    res.status(400).send({ msg: "Bad Request" });
  } else {
    console.log(err);
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
