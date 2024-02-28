const express = require("express");
const currencyRouter = express.Router();
const currencyController = require("../controllers/currency.controller");
const roles = require("../../helpers/roles");

currencyRouter.get("/", currencyController.getAllData);
currencyRouter.post("/", roles.isAuthenticatedAsAdmin, currencyController.create);
currencyRouter.get(
  "/educationSystem/:educationSystemId",
  currencyController.findCurrencyByEducationSystem
);
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

module.exports = currencyRouter;
