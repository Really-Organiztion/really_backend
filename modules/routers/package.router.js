const express = require("express");
const packageRouter = express.Router();
const packageController = require("../controllers/package.controller");
const roles = require("../../helpers/roles");

packageRouter.get(
  "/",
  roles.isAuthenticatedAsAdmin,
  packageController.getAllData
);
packageRouter.post("/", roles.isAuthenticatedAsAdmin, packageController.create);
packageRouter.get(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  packageController.findById
);
packageRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  packageController.updatePackage
);
packageRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  packageController.deletePackage
);

module.exports = packageRouter;
