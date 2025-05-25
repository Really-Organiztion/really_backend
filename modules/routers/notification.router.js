const express = require("express");
const notificationRouter = express.Router();
const notificationController = require("../controllers/notification.controller");
const roles = require("../../helpers/roles");

notificationRouter.get("/", notificationController.getAllData);
notificationRouter.post("/send", notificationController.send);
notificationRouter.put("/seen/:id", notificationController.seen);
notificationRouter.post("/", notificationController.create);
notificationRouter.get(
  "/user/:id",
  notificationController.getNotificationByUserId
);
notificationRouter.get("/:id", notificationController.findById);
notificationRouter.put("/:id", notificationController.updateNotification);
notificationRouter.delete("/:id", notificationController.deleteNotification);
notificationRouter.delete("/user/:id", notificationController.deleteUserNotifications);

module.exports = notificationRouter;
