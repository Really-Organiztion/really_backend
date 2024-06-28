const bankModel = require("../models/bank.model");
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
      { name: { $regex: req.body["search"], $options: "i" } },
      { nameAr: { $regex: req.body["search"], $options: "i" } },
      { nameAr: { $regex: req.body["search"], $options: "i" } },
      { nameAr: { $regex: req.body["search"], $options: "i" } },
      { nameAr: { $regex: req.body["search"], $options: "i" } },
      { nameAr: { $regex: req.body["search"], $options: "i" } },
    ];
  }
  let $group = {
    _id: "$_id",
    name: { $first: `$${toFound}` },
   
  };
  if (!req.query.lang) {
    $group["nameAr"] = { $first: `$nameAr` };
  }
  bankModel.defaultSchema
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
  deleteBank: bankModel.genericSchema.delete,
  updateBank: bankModel.genericSchema.update,
  findById: bankModel.genericSchema.findById,
  create: bankModel.genericSchema.create,
  findAll,
};
