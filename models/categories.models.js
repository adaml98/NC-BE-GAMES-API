const db = require("../db/connection");
const { convertTimestampToDate } = require("../db/seeds/utils");

exports.fetchCategories = () => {
  return db.query(`SELECT * FROM categories;`).then((categories) => {
    return categories.rows;
  });
};

exports.fetchReview = (review_id) => {
  return db
    .query(
      `
  SELECT * 
  FROM reviews
  WHERE review_id = $1;
  `,
      [review_id]
    )
    .then((review) => {
      if (review.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `404 Not Found`,
        });
      }
      return review.rows[0];
    });
};

exports.fetchReviews = () => {
  return db
    .query(
      `
    Select reviews.*, COUNT(comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;
  `
    )
    .then((reviews) => {
      return reviews.rows;
    });
};

exports.fetchReviewComments = (review_id) => {
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE review_id = $1
    ORDER BY created_at ASC;
    `,
      [review_id]
    )
    .then((comments) => {
      if (comments.rows.length === 0) {
        return checkReviewExists(review_id).then(() => {
          return comments.rows;
        });
      }
      return comments.rows;
    });
};

exports.submitReviewComment = (newComment, review_id) => {
  const { username, body } = newComment;
  return db
    .query(
      `
    INSERT INTO comments 
      (author, body, review_id)
    VALUES
      ($1, $2, $3)
    RETURNING *;
    `,
      [username, body, review_id]
    )
    .then(({ rows }) => rows[0]);
};

const checkReviewExists = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `404 Not Found`,
        });
      }
    });
};
