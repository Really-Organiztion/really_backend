const rateModel = require("../models/rate.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  let $match = {};
  if (req.body && req.body.isDeleted) {
    $match = { isDeleted: true };
  } else {
    $match = { isDeleted: false };
  }
  rateModel.defaultSchema
    .aggregate([
      {
        $match,
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: `$${toFound}` },
          numericCode: { $first: `$numericCode` },
          code: { $first: `$code` },
          flag: { $first: `$flag` },
        },
      },
    ])
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
