const express = require("express");
const unitRouter = express.Router();
const unitController = require("../controllers/unit.controller");
const roles = require("../../helpers/roles");

unitRouter.post("/all", unitController.getAllData);
unitRouter.post("/", unitController.create);
unitRouter.get("/:id", unitController.findById);
unitRouter.put(
  "/:id",
  unitController.updateUnit
);
unitRouter.delete(
  "/:id",
  unitController.deleteUnit
);

module.exports = unitRouter;
