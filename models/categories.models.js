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
      return review.rows;
    });
};
