const express = require("express");
const requestRouter = express.Router();
const requestController = require("../controllers/request.controller");
const roles = require("../../helpers/roles");

requestRouter.post("/all", requestController.getAllData);
requestRouter.post("/", roles.isAuthenticatedAsAdmin, requestController.create);
requestRouter.get("/:id", requestController.findById);
requestRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  requestController.updateRequest
);
requestRouter.delete("/:id", requestController.deleteRequest);
requestRouter.delete("/deleteAll/:userId", requestController.deleteAllRequest);

module.exports = requestRouter;
