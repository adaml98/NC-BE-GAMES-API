const { getUsers, getUser } = require("../controllers/categories.controllers");

const usersRouter = require("express").Router();

usersRouter.get("/", getUsers);

usersRouter.get("/:username", getUser);

module.exports = usersRouter;
