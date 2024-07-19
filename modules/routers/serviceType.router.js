const express = require("express");
const serviceTypeRouter = express.Router();
const serviceTypeController = require("../controllers/serviceType.controller");
const roles = require("../../helpers/roles");

serviceTypeRouter.post("/", serviceTypeController.getAllData);
serviceTypeRouter.post("/", roles.isAuthenticatedAsAdmin, serviceTypeController.create);
serviceTypeRouter.get("/:id", serviceTypeController.findById);
serviceTypeRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  serviceTypeController.updateServiceType
);
serviceTypeRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  serviceTypeController.deleteServiceType
);

module.exports = serviceTypeRouter;
