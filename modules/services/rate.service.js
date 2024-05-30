const rateModel = require("../models/rate.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  let where = req.body || {};
  if (req.body) {
    if (req.body.isDeleted) {
      where = { isDeleted: true };
    } else {
      where = { isDeleted: false };
    }
    if (req.body.userId) {
      where["userId"] = new ObjectId(req.body.userId);
    }
    if (req.body.unitId) {
      where["unitId"] = new ObjectId(req.body.unitId);
    }
  } else {
    where = { isDeleted: false };
  }
  rateModel.defaultSchema
  .find(where)
  .sort({ _id: -1 })
  .populate("unitId", [`${toFound}`, "type"])
  .populate("userId", ["username", "phone", "profileImage"])
  .skip((pageNumber - 1) * pageSize)
  .limit(pageSize)
  .then(function (data) {
    res.status(200).send(data);
  })
  .catch(function (err) {
    res.status(400).send(err);
  });
};

updateRate = async (req, res, id) => {
  return new Promise((resolve, reject) => {
    rateModel.defaultSchema
      .findOneAndUpdate({ _id: id }, req.body)
      .then(function (doc) {
        resolve(doc);
      })
      .catch(function (err) {
        reject(err);
        res.status(400).send(err);
      });
  });
};

deleteRate = async (req, res, id) => {
  return new Promise((resolve, reject) => {
    rateModel.defaultSchema
      .findOneAndDelete({
        _id: id,
      })
      .then(function (doc) {
        resolve(doc);
      })
      .catch(function (err) {
        reject(err);
        res.status(400).send(err);
      });
  });
};

createRate = async (req, res) => {
  return new Promise((resolve, reject) => {
    rateModel.defaultSchema
      .create(req.body)
      .then(function (doc) {
        resolve(doc);
      })
      .catch(function (err) {
        reject(err);
        res.status(400).send(err);
      });
  });
};

module.exports = {
  deleteRate,
  updateRate,
  findById: rateModel.genericSchema.findById,
  createRate,
  findAll,
};
