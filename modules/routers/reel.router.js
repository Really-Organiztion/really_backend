const express = require("express");
const reelRouter = express.Router();
const reelController = require("../controllers/reel.controller");
const roles = require("../../helpers/roles");

reelRouter.post("/all", reelController.getAllData);
reelRouter.post("/", reelController.create);
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
