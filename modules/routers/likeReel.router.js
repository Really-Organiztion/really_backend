const express = require("express");
const likeReelRouter = express.Router();
const likeReelController = require("../controllers/likeReel.controller");
const roles = require("../../helpers/roles");

likeReelRouter.post("/", likeReelController.create);
likeReelRouter.post("/all", likeReelController.getAllData);
likeReelRouter.get("/:id", likeReelController.findById);
likeReelRouter.put(
  "/:id/:reelId",
  likeReelController.updateLikeReel
);
likeReelRouter.delete(
  "/:id/:reelId",
  likeReelController.deleteLikeReel
);

module.exports = likeReelRouter;
