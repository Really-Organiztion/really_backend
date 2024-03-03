const express = require("express");
const countryRouter = express.Router();
const countryController = require("../controllers/country.controller");
const roles = require("../../helpers/roles");

countryRouter.get("/", countryController.getAllData);
countryRouter.post("/", roles.isAuthenticatedAsAdmin, countryController.create);

countryRouter.get("/:id",countryController.findById);
countryRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  countryController.updateCountry
);
countryRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  countryController.deleteCountry
);

module.exports = countryRouter;
