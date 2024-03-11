const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controllers/comment.controller");
const roles = require("../../helpers/roles");

commentRouter.get("/", commentController.getAllData);
commentRouter.post("/", roles.isAuthenticatedAsAdmin, commentController.create);
commentRouter.get("/:id", roles.isAuthenticatedAsAdmin, commentController.findById);
commentRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  commentController.updateComment
);
commentRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  commentController.deleteComment
);

module.exports = commentRouter;
