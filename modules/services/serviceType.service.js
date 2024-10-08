const serviceTypeModel = require("../models/serviceType.model");
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
  if (req.body["search"]) {
    $match.$or = [
      { name: { $regex: req.body["search"], $options: "i" } },
      { nameAr: { $regex: req.body["search"], $options: "i" } },
      { "subServicesList.name": { $regex: req.body["search"], $options: "i" } },
      {
        "subServicesList.nameAr": { $regex: req.body["search"], $options: "i" },
      },
    ];
  }
  serviceTypeModel.defaultSchema
    .aggregate([
      {
        $match,
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: `$name` },
          nameAr: { $first: `$nameAr` },
          subServicesList: { $first: `$subServicesList` },
        },
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
  deleteServiceType: serviceTypeModel.genericSchema.delete,
  updateServiceType: serviceTypeModel.genericSchema.update,
  findById: serviceTypeModel.genericSchema.findById,
  create: serviceTypeModel.genericSchema.create,
  findAll,
};
