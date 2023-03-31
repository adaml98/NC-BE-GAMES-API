const { getEndpoints } = require("../controllers/categories.controllers");

const apiRouter = require("express").Router();

apiRouter.get("/", getEndpoints);

module.exports = apiRouter;
