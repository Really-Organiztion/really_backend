const notificationModel = require("../models/notification.model");

getNotificationByUserId = (req, res, userId) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  notificationModel.defaultSchema
    .find({ userId })
    .sort({ _id: -1 })
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

createMany = async (notifications) => {
  try {
    const data = await notificationModel.defaultSchema.insertMany(notifications);
    return data; 
  } catch (err) {
    throw err;
  }
};

seen = (res, id) => {
  notificationModel.defaultSchema
    .updateOne({ _id: id }, { $set: { seen: true } })
    .then((data) => res.status(200).send({message: "Update seen Success"}))
    .catch((err) => res.status(400).send(err));
};

deleteUserNotifications = (req, res, userId) => {
  notificationModel.defaultSchema
    .deleteMany({ userId })
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
};

module.exports = {
  deleteNotification: notificationModel.genericSchema.delete,
  updateNotification: notificationModel.genericSchema.update,
  findById: notificationModel.genericSchema.findById,
  create: notificationModel.genericSchema.create,
  findAll: notificationModel.genericSchema.findAll,
  deleteUserNotifications,
  getNotificationByUserId,
  seen,
  createMany,
  callbackGetNotificationByUserId,
};
