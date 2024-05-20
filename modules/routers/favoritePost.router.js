const express = require("express");
const favoritePostRouter = express.Router();
const favoritePostController = require("../controllers/favoritePost.controller");
const roles = require("../../helpers/roles");

favoritePostRouter.post("/", favoritePostController.create);
favoritePostRouter.post("/all", favoritePostController.getAllData);
favoritePostRouter.get("/:id", favoritePostController.findById);
favoritePostRouter.put(
  "/:id/:postId",
  favoritePostController.updateFavoritePost
);
favoritePostRouter.delete(
  "/:id/:postId",
  favoritePostController.deleteFavoritePost
);

module.exports = favoritePostRouter;
