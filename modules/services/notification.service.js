const notificationModel = require("../models/notification.model");

getNotificationByUserId = (req, res, userId) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  notificationModel.defaultSchema
    .find({ userId })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .select({ notification: 1 })
    .sort({ date: -1 })
    .exec((err, data) => res.json(err || data));
};

callbackGetNotificationByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    notificationModel.defaultSchema
      .find({ userId })
      .select({ notification: 1 })
      .sort({ date: -1 })
      .exec((err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
  });
};

module.exports = {
  deleteNotification: notificationModel.genericSchema.delete,
  updateNotification: notificationModel.genericSchema.update,
  findById: notificationModel.genericSchema.findById,
  create: notificationModel.genericSchema.create,
  findAll: notificationModel.genericSchema.findAll,
  getNotificationByUserId,
  callbackGetNotificationByUserId,
};
