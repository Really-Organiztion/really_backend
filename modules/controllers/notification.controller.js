const notificationService = require("../services/notification.service");
const logger = require("../../helpers/logging");
const fireBase = require("../../helpers/fireBase");
const userService = require("../services/user.service");

getAllData = (req, res) => {
  try {
    notificationService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
    notificationService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

send = async (req, res) => {
  try {
    let notificationList = [];
    let deviceTokenList = [];
    if (req.body.action != "Send") {
      if (req.body.type == "Private") {
        notificationList = [{ ...req.body }];
      } else if (
        req.body.type == "Renter" ||
        req.body.type == "Investor" ||
        req.body.type == "Owner"
      ) {
        let userList = await userService.getAllIdAndDeviceToken({
          role: req.body.type,
          status: "Active",
          isDeleted: false,
        });
        notificationList = userList.map((_u) => ({ ...req.body, userId: _u._id }));
        
        deviceTokenList = userList.map((_u) => _u.deviceToken);
      } else if (req.body.type == "Public") {
        let userList = await userService.getAllIdAndDeviceToken({
          status: "Active",
          isDeleted: false,
        });
        notificationList = userList.map((_u) => ({ ...req.body, userId: _u._id }));
        deviceTokenList = userList.map((_u) => _u.deviceToken);

      } else if (req.body.type == "Custom") {
        if (req.body.userIdList) {
          notificationList = req.body.userIdList.map((_u) => ({
            ...req.body,
            userId: _u._id,
          }));
        }
      }
      fireBase.sendFcm({ ...req.body,deviceTokenList });

      notificationService.createMany(notificationList, res);
    }
    if (req.body.action != "Save") {
      if (req.body.deviceTokenList.length > 0) {
        req.body.deviceTokenList = deviceTokenList;
      }
      fireBase.sendFcm(req.body);
      res.status(200).send("Success");
    }
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    notificationService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateNotification = (req, res) => {
  try {
    const id = req.params.id;
    notificationService.updateNotification(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteNotification = (req, res) => {
  try {
    const id = req.params.id;
    notificationService.deleteNotification(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
getNotificationByUserId = (req, res) => {
  try {
    const id = req.params.id;
    notificationService.getNotificationByUserId(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
callbackGetNotificationByUserId = (id) => {
  try {
    return notificationService.callbackGetNotificationByUserId(id);
  } catch (error) {
    logger.error(error);
  }
};
module.exports = {
  send,
  getAllData,
  create,
  findById,
  updateNotification,
  deleteNotification,
  getNotificationByUserId,
  callbackGetNotificationByUserId,
};
