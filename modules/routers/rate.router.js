const express = require("express");
const rateRouter = express.Router();
const rateController = require("../controllers/rate.controller");
const roles = require("../../helpers/roles");

rateRouter.get("/", rateController.getAllData);
rateRouter.post("/", roles.isAuthenticatedAsAdmin, rateController.create);
rateRouter.get("/:id", roles.isAuthenticatedAsAdmin, rateController.findById);
rateRouter.put(
  "/:id/:unitId",
  roles.isAuthenticatedAsAdmin,
  rateController.updateRate
);
rateRouter.delete(
  "/:id/:unitId",
  roles.isAuthenticatedAsAdmin,
  rateController.deleteRate
);

module.exports = rateRouter;
