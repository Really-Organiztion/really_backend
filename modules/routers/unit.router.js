const express = require("express");
const unitRouter = express.Router();
const unitController = require("../controllers/unit.controller");
const roles = require("../../helpers/roles");

unitRouter.get("/", unitController.getAllData);
unitRouter.post("/", roles.isAuthenticatedAsAdmin, unitController.create);
unitRouter.get("/:id", unitController.findById);
unitRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  unitController.updateUnit
);
unitRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  unitController.deleteUnit
);

module.exports = unitRouter;
