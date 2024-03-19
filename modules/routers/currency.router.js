const express = require("express");
const currencyRouter = express.Router();
const currencyController = require("../controllers/currency.controller");
const roles = require("../../helpers/roles");

currencyRouter.post("/all", currencyController.getAllData);
currencyRouter.post("/", roles.isAuthenticatedAsAdmin, currencyController.create);
currencyRouter.get("/:id", roles.isAuthenticatedAsAdmin, currencyController.findById);
currencyRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  currencyController.updateCurrency
);
currencyRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  currencyController.deleteCurrency
);

currencyRouter.put(
  "/deleteReturn/:id",
  roles.isAuthenticatedAsAdmin,
  currencyController.deleteReturn
);
module.exports = currencyRouter;
