const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const roles = require("../../helpers/roles");

postRouter.get("/", postController.getAllData);
postRouter.get("/filterPost", postController.getAllDataFilterPost);
postRouter.post("/", postController.create);
postRouter.get("/:id", postController.findById);
postRouter.put(
  "/:id",
  postController.updatePost
);
postRouter.delete(
  "/:id",
  postController.deletePost
);

module.exports = postRouter;
