const express = require("express");
const requestRouter = express.Router();
const requestController = require("../controllers/request.controller");
const roles = require("../../helpers/roles");

requestRouter.post("/all", requestController.getAllData);
requestRouter.post("/",  requestController.create);
requestRouter.get("/:id", requestController.findById);
requestRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  requestController.updateRequest
);
requestRouter.delete("/:id",roles.isAuthenticatedAsAdmin, requestController.deleteRequest);
requestRouter.delete("/isDelete/:id", requestController.isDeleteRequest);
requestRouter.post("/deleteAll",roles.isAuthenticatedAsAdmin, requestController.deleteAllRequest);

module.exports = requestRouter;
