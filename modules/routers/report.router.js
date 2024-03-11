const express = require("express");
const reportRouter = express.Router();
const reportController = require("../controllers/report.controller");
const roles = require("../../helpers/roles");

reportRouter.get("/", reportController.getAllData);
reportRouter.post("/", roles.isAuthenticatedAsAdmin, reportController.create);
reportRouter.get("/:id", roles.isAuthenticatedAsAdmin, reportController.findById);
reportRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  reportController.updateReport
);
reportRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  reportController.deleteReport
);

module.exports = reportRouter;
