const express = require("express");
const termsRouter = express.Router();
const termsController = require("../controllers/terms.controller");
const roles = require("../../helpers/roles");

termsRouter.post("/all", termsController.getAllData);
termsRouter.post("/", roles.isAuthenticatedAsAdmin, termsController.create);
termsRouter.get("/:id", roles.isAuthenticatedAsAdmin, termsController.findById);
termsRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  termsController.updateTerms
);
termsRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  termsController.deleteTerms
);

termsRouter.put(
  "/deleteReturn/:id",
  roles.isAuthenticatedAsAdmin,
  termsController.deleteReturn
);
module.exports = termsRouter;
