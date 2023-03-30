const db = require("../db/connection");

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

exports.fetchReviews = (category, sort_by = "created_at", order = "DESC") => {
  console.log(category, sort_by, order);
  if (!category) {
    return db
      .query(
        `
    Select reviews.*, COUNT(comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY ${sort_by} ${order};
  `
      )
      .then((reviews) => {
        return reviews.rows;
      });
  } else {
    return db
      .query(
        `
    Select reviews.*, COUNT(comment_id) AS comment_count 
    FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id 
    WHERE category = $1 
    GROUP BY reviews.review_id 
    ORDER BY ${sort_by} ${order};
  `,
        [category]
      )
      .then((reviews) => {
        return reviews.rows;
      });
  }
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

exports.editReview = (inc_votes, review_id) => {
  return db
    .query(
      `UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *;
  `,
      [inc_votes, review_id]
    )
    .then((updatedReview) => {
      if (updatedReview.rows.length === 0) {
        return checkReviewExists(review_id).then(() => {
          return updatedReview.rows[0];
        });
      }
      return updatedReview.rows[0];
    });
};
const checkCommentExists = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `404 Not Found`,
        });
      }
    });
};

exports.removeComment = (comment_id) => {
  return checkCommentExists(comment_id).then(() => {
    return db
      .query(
        `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;
  `,
        [comment_id]
      )
      .then((result) => {
        return result.rows;
      });
  });
};

exports.fetchUsers = () => {
  return db
    .query(
      `
      SELECT * FROM users;
      `
    )
    .then((users) => {
      return users.rows;
    });
};
