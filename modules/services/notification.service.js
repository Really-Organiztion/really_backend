const notificationModel = require("../models/notification.model");
const { ObjectId } = require("mongoose").Types;

findAll = (req, res) => {
  const pageNumber = parseInt(req.query.pageNumber || 1);
  const pageSize = parseInt(req.query.pageSize || 10);

  req.body = req.body || {};
  let $match = {};

  if (typeof req.body.seen === "boolean") {
    $match.seen = req.body.seen;
  }

  if (req.body.userId && ObjectId.isValid(req.body.userId)) {
    $match.userId = new ObjectId(req.body.userId);
  }

  if (req.body.type) {
    $match.type = req.body.type;
  }

  if (req.body.search) {
    $match.$or = [
      { title: { $regex: req.body.search, $options: "i" } },
      { message: { $regex: req.body.search, $options: "i" } },
      { screen: { $regex: req.body.search, $options: "i" } },
    ];
  }

  const $group = {
    _id: "$_id",
    title: { $first: "$title" },
    message: { $first: "$message" },
    userId: { $first: "$userId" },
    seen: { $first: "$seen" },
    action: { $first: "$action" },
    screen: { $first: "$screen" },
    type: { $first: "$type" },
    date: { $first: "$date" },
  };

  notificationModel.defaultSchema
    .aggregate([
      { $match },
      { $group },
      { $sort: { _id: -1 } },
      { $skip: (pageNumber - 1) * pageSize },
      { $limit: pageSize },
    ])
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
};

getNotificationByUserId = (req, res, userId) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  notificationModel.defaultSchema
    .find({ userId })
    .sort({ _id: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ date: -1 })
    .then((data) => res.status(200).send(data))
    .catch((err) => res.status(400).send(err));
};

callbackGetNotificationByUserId = (userId) => {
  return new Promise((resolve, reject) => {
    notificationModel.defaultSchema
      .find({ userId })
      .select({ notification: 1 })
      .sort({ date: -1 })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
};

createMany = async (notifications) => {
  try {
    const data = await notificationModel.defaultSchema.insertMany(
      notifications
    );
    return data;
  } catch (err) {
    throw err;
  }
};

seen = (res, id) => {
  notificationModel.defaultSchema
    .updateOne({ _id: id }, { $set: { seen: true } })
    .then((data) => res.status(200).send({ message: "Update seen Success" }))
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
  findAll,
  deleteUserNotifications,
  getNotificationByUserId,
  seen,
  createMany,
  callbackGetNotificationByUserId,
};
