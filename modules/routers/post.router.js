const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const roles = require("../../helpers/roles");

postRouter.post("/", postController.create);
postRouter.put(
  "/:id",
  postController.updatePost
);
postRouter.delete(
  "/:id",
  postController.deletePost
);

module.exports = postRouter;
