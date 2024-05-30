const currencyModel = require("../models/currency.model");
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
  if (req.body["search"]) {
    $match.$or = [
      { numericCode: { $regex: req.body["search"], $options: "i" } },
      { name: { $regex: req.body["search"], $options: "i" } },
      { nameAr: { $regex: req.body["search"], $options: "i" } },
      { code: { $regex: req.body["search"], $options: "i" } },
    ];
  }
  let $group = {
    _id: "$_id",
    name: { $first: `$${toFound}` },
    numericCode: { $first: `$numericCode` },
    code: { $first: `$code` },
    flag: { $first: `$flag` },
  };
  if (!req.query.lang) {
    $group["nameAr"] = { $first: `$nameAr` };
  }
  currencyModel.defaultSchema
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
  deleteCurrency: currencyModel.genericSchema.delete,
  deleteReturn: currencyModel.genericSchema.deleteReturn,
  updateCurrency: currencyModel.genericSchema.update,
  findById: currencyModel.genericSchema.findById,
  create: currencyModel.genericSchema.create,
  findAll,
};
