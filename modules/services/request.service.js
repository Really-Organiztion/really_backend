const requestModel = require("../models/request.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  let where = req.body || {};
  if (req.body && req.body.isDeleted) {
    where = { isDeleted: true };
  } else {
    where = { isDeleted: false };
  }
  if (req.body && req.body.userId) {
    where["userId"] = new ObjectId(req.body.userId);
  }
  if (req.body && req.body.adminId) {
    where["adminId"] = new ObjectId(req.body.adminId);
  }
  if (req.body && req.body.name) {
    where["name"] = { $regex: req.body["name"], $options: "i" };
  }
  if (req.body && req.body.nameAr) {
    where["nameAr"] = { $regex: req.body["nameAr"], $options: "i" };
  }

  requestModel.defaultSchema
    .find(where)
    .sort({ _id: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .populate("userId", ["username", "phone"])
    .populate("adminId", ["username", "role"])
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

deleteRequest = async (req, res, id) => {
  requestModel.defaultSchema
    .deleteOne({
      _id: id,
    })
    .then(function (data) {
      res.status(200).send("Deleted successfully");
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

deleteAllRequest = async (req, res) => {
  let where = req.body || {};

  if (req.body && req.body.userId) {
    where["userId"] = new ObjectId(req.body.userId);
  }

  if (req.body && req.body.adminId) {
    where["adminId"] = new ObjectId(req.body.adminId);
  }

  requestModel.defaultSchema
    .deleteMany(where)
    .then(function (data) {
      res.status(200).send("Deleted successfully");
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

module.exports = {
  deleteRequest,
  isDeleteRequest: requestModel.genericSchema.delete,
  deleteAllRequest,
  updateRequest: requestModel.genericSchema.update,
  findById: requestModel.genericSchema.findById,
  create: requestModel.genericSchema.create,
  findAll,
};
