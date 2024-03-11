const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller");
const roles = require("../../helpers/roles");

postRouter.get("/", postController.getAllData);
postRouter.post("/", roles.isAuthenticatedAsAdmin, postController.create);
postRouter.get("/:id", roles.isAuthenticatedAsAdmin, postController.findById);
postRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  postController.updatePost
);
postRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  postController.deletePost
);

module.exports = postRouter;
