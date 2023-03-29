exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  console.log(err);
  if (err.code === "23503") {
    res.status(404).send({ msg: "404 Not Found" });
  } else if (
    err.code === "42703" ||
    err.code === "22P02" ||
    err.code === "23502"
  ) {
    res.status(400).send({ msg: "Bad Request" });
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "Internal Server Error" });
};
