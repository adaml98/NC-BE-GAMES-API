const {
  getReviews,
  getReviewComments,
  getReview,
  patchReview,
  postReviewComment,
} = require("../controllers/categories.controllers");

const reviewsRouter = require("express").Router();

reviewsRouter.get("/", getReviews);

reviewsRouter.route("/:review_id").get(getReview).patch(patchReview);

reviewsRouter
  .route("/:review_id/comments")
  .get(getReviewComments)
  .post(postReviewComment);

module.exports = reviewsRouter;
