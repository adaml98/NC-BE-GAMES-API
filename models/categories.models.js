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
          msg: `Invalid ID`,
        });
      }
      return review.rows[0];
    });
};
