const notificationService = require("../services/notification.service");
const logger = require("../../helpers/logging");

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
  getAllData,
  create,
  findById,
  updateNotification,
  deleteNotification,
  getNotificationByUserId,
  callbackGetNotificationByUserId,
};
