const {
  fetchCategories,
  fetchReview,
  fetchReviews,
  fetchReviewComments,
  editReview,
  submitReviewComment,
  removeComment,
  fetchUsers,
  fetchEndpoints,
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

exports.getReviews = (req, res, next) => {
  const { category, sort_by, order } = req.query;
  fetchReviews(category, sort_by, order)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch(next);
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
    })
    .catch(next);
};

exports.postReviewComment = (req, res, next) => {
  const newComment = req.body;
  const review_id = req.params.review_id;
  submitReviewComment(newComment, review_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const comment_id = req.params.comment_id;
  removeComment(comment_id)
    .then((result) => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

exports.getEndpoints = (req, res) => {
  fetchEndpoints().then((endpoints) => {
    const parsedEndpoint = JSON.parse(endpoints);
    res.status(200).send({ endpoints: parsedEndpoint });
  });
};
