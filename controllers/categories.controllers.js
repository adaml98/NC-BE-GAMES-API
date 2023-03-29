const {
  fetchCategories,
  fetchReview,
  fetchReviews,
  fetchReviewComments,
  editReview,
  submitReviewComment,
} = require("../models/categories.models");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReview = (req, res, next) => {
  const review_id = req.params.review_id;
  fetchReview(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch(next);
};

exports.getReviews = (req, res) => {
  fetchReviews().then((reviews) => {
    res.status(200).send({ reviews });
  });
};

exports.getReviewComments = (req, res, next) => {
  const review_id = req.params.review_id;
  fetchReviewComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};


exports.patchReview = (req, res, next) => {
  const review_id = req.params.review_id;
  const inc_votes = req.body.inc_votes;
  editReview(inc_votes, review_id)
    .then((editedReview) => {
      res.status(200).send({ editedReview });

exports.postReviewComment = (req, res, next) => {
  const newComment = req.body;
  const review_id = req.params.review_id;
  submitReviewComment(newComment, review_id)
    .then((comment) => {
      res.status(201).send({ comment });

    })
    .catch(next);
};
