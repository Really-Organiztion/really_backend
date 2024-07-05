const termsModel = require("../models/terms.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  req.body = req.body || {};
  let $match = {};
  if (req.body && req.body.isDeleted) {
    $match = { isDeleted: true };
  } else {
    $match = { isDeleted: false };
  }
  if (req.body["type"]) {
    $match["type"] = req.body["type"];
  }
  if (req.body["search"]) {
    $match.$or = [
      { name: { $regex: req.body["search"], $options: "i" } },
      { nameAr: { $regex: req.body["search"], $options: "i" } },
      { type: { $regex: req.body["search"], $options: "i" } },
    ];
  }
  let $group = {
    _id: "$_id",
    name: { $first: `$${toFound}` },
    type: { $first: `$type` },
    dateTime: { $first: `$dateTime` },
    version: { $first: `$version` },
    createdAt: { $first: `$createdAt` },
    updatedAt: { $first: `$updatedAt` },
    isDeleted: { $first: `$isDeleted` },
    type: { $first: `$type` },
  };
  if (!req.query.lang) {
    $group["nameAr"] = { $first: `$nameAr` };
  }
  termsModel.defaultSchema
    .aggregate([
      {
        $match,
      },
      {
        $group,
      },
    ])
    .sort({ _id: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

module.exports = {
  deleteTerms: termsModel.genericSchema.delete,
  deleteReturn: termsModel.genericSchema.deleteReturn,
  updateTerms: termsModel.genericSchema.update,
  findById: termsModel.genericSchema.findById,
  create: termsModel.genericSchema.create,
  findAll,
};
