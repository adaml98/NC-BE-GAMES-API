const express = require("express");
const cors = require("cors");

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index.js");

const apiRouter = require("./routes/api-router");
const categoriesRouter = require("./routes/categories-router");
const commentsRouter = require("./routes/comments-router");
const reviewsRouter = require("./routes/reviews-router");
const usersRouter = require("./routes/users-router");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.use("/api/categories", categoriesRouter);
app.use("/api/reviews", reviewsRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/users", usersRouter);
app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
