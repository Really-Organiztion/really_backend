const express = require("express");
const notificationRouter = express.Router();
const notificationController = require("../controllers/notification.controller");
const roles = require("../../helpers/roles");

notificationRouter.get("/", notificationController.getAllData);
notificationRouter.post("/", notificationController.create);
notificationRouter.get(
  "/user/:id",
  notificationController.getNotificationByUserId
);
notificationRouter.get("/:id", notificationController.findById);
notificationRouter.put("/:id", notificationController.updateNotification);
notificationRouter.delete("/:id", notificationController.deleteNotification);

module.exports = notificationRouter;
