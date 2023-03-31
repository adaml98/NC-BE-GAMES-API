const { getUsers } = require("../controllers/categories.controllers");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);

module.exports = usersRouter;
