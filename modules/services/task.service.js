const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const taskModel = require("../models/task.model");
const handleFiles = require("../../helpers/handleFiles");
const attachmentPath = require("../../helpers/attachmentPath.json");
const path = attachmentPath.attachments.taskAttachmentPath;

createTaskWithAttachment = async (req, res) => {
  if (req.body.deliveredTask) {
    try {
      req.body.deliveredTask = await handleFiles.saveFiles(
        req.body.deliveredTask,
        "Task",
        path
      );
    } catch (error) {
      return res.status(400).send(error);
    }
  }
  taskModel.defaultSchema.create(req.body, function (err, cat) {
    if (err) res.status(400).send(err);
    else res.status(201).send(req.body);
  });
};

checkUserTask = (req, res, taskId, userId) => {
  taskModel.defaultSchema
    .findOne({ taskId, userId })
    .select({ __v: 0 })
    .sort({ date: -1 })
    .exec((err, data) => {
      if (err) res.status(400).send(err);
      else {
        if (data && data._id) {
          res.status(200).send("Found");
        } else {
          res.status(404).send("Not Found");
        }
      }
    });
};

getDeliveredTaskByTaskId = (req, res, taskId) => {
  let toFind;
  let query;
  if (req.query.filter === "pass") {
    query = { $gte: 50 };
  } else if (req.query.filter === "fail") {
    query = { $lt: 50 };
  } else query = "";
  if (req.query.filter) {
    toFind = {
      taskId: ObjectId(taskId),
      score: query,
    };
  } else {
    toFind = {
      taskId: ObjectId(taskId),
    };
  }
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  taskModel.defaultSchema
    .find(toFind)
    .populate("userId", ["firstName", "lastName", "phoneNumber"])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .select({ __v: 0 })
    .sort({ date: -1 })
    .exec((err, data) => res.json(err || data));
};

replaceTaskAttachment = async (req, res, id) => {
  if (req.body.toDelete) {
    handleFiles.deleteFile(req.body.toDelete, path);
  }
  if (req.body.deliveredTask) {
    try {
      req.body.deliveredTask = await handleFiles.saveFiles(
        req.body.deliveredTask,
        "Task",
        path
      );
    } catch (error) {
      return res.status(400).send(error);
    }
  }
  taskModel.defaultSchema.findByIdAndUpdate(
    id,
    { $set: { deliveredTask: req.body.deliveredTask } },
    {
      // While Update: show last updated document with new values
      new: true,
      // While Update: the default values will inserted without passing values explicitly
      setDefaultsOnInsert: true,
    },
    function (err, data) {
      if (err) res.status(400).send(err);
      else if (data === null) res.status(404).send("ID is not found");
      else res.status(200).send(data);
    }
  );
};
module.exports = {
  deleteTask: taskModel.genericSchema.delete,
  updateTask: taskModel.genericSchema.update,
  findById: taskModel.genericSchema.findById,
  create: createTaskWithAttachment,
  findAll: taskModel.genericSchema.findAll,
  getDeliveredTaskByTaskId,
  replaceTaskAttachment,
  checkUserTask,
};
