const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controllers/comment.controller");
const roles = require("../../helpers/roles");

commentRouter.get("/", commentController.getAllData);
commentRouter.post("/", commentController.create);
commentRouter.get("/:id", commentController.findById);
commentRouter.put(
  "/:id",
  commentController.updateComment
);
commentRouter.delete(
  "/:id",
 
  commentController.deleteComment
);

module.exports = commentRouter;
