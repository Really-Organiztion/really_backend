const express = require("express");
const publicRouter = express.Router();
const postController = require("../controllers/post.controller");
const roles = require("../../helpers/roles");

publicRouter.get("/post/", postController.getAllData);
publicRouter.get("/post/filterPost", postController.getAllDataFilterPost);
publicRouter.get("/post/:id", postController.findById);

module.exports = publicRouter;
