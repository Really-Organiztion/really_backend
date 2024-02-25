const express = require("express");
const previewRouter = express.Router();
const previewController = require("../controllers/preview.controller");
const roles = require("../../helpers/roles");

previewRouter.get("/", previewController.getAllData);
previewRouter.post("/", roles.isAuthenticatedAsAdmin, previewController.create);
previewRouter.get(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  previewController.findById
);
previewRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  previewController.updatePreview
);
previewRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  previewController.deletePreview
);

module.exports = previewRouter;
