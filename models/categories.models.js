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
  WHERE review_id = ${review_id};
  `
    )
    .then((review) => {
      if (review.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `ID can not be found`,
        });
      }
      return review.rows[0];
    });
};

exports.fetchReviews = () => {
  return db.query(
    `
    Select reviews.*, COUNT(comment_id) AS comment_count
    FROM reviews
    LEFT JOIN comments ON reviews.review_id = comments.review_id
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;
  `
  );
};
