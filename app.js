const express = require("express");
const {
  getCategories,
  getReview,
  getReviews,
  getReviewComments,
  patchReview,
  postReviewComment,
  deleteComment,
  getUsers,
} = require("./controllers/categories.controllers");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index.js");

const app = express();

app.use(express.json());

app.get("/api/categories", getCategories);
app.get("/api/reviews/:review_id", getReview);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getReviewComments);
app.get("/api/users", getUsers);

app.patch("/api/reviews/:review_id", patchReview);

app.post("/api/reviews/:review_id/comments", postReviewComment);

app.delete("/api/comments/:comment_id", deleteComment);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
