const express = require("express");
const reelRouter = express.Router();
const reelController = require("../controllers/reel.controller");
const roles = require("../../helpers/roles");

reelRouter.post("/", reelController.create);
reelRouter.post("/all", reelController.getAllData);
reelRouter.get("/:id", reelController.findById);
reelRouter.put(
  "/:id",
 
  reelController.updateReel
);
reelRouter.delete(
  "/:id",
 
  reelController.deleteReel
);

reelRouter.put(
  "/deleteReturn/:id",
 
  reelController.deleteReturn
);
module.exports = reelRouter;
