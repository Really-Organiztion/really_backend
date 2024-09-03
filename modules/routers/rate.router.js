const express = require("express");
const rateRouter = express.Router();
const rateController = require("../controllers/rate.controller");
const roles = require("../../helpers/roles");

rateRouter.post("/all", rateController.getAllData);
rateRouter.post("/", rateController.create);
rateRouter.get("/:id", rateController.findById);
rateRouter.put(
  "/:id",
  rateController.updateRate
);
rateRouter.delete(
  "/:id/:unitId",
  rateController.deleteRate
);

module.exports = rateRouter;
