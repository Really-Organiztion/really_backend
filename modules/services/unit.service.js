const unitModel = require("../models/unit.model");
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
  unitModel.defaultSchema
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
updateUnitRateCb = (obj, id) => {
  return new Promise((resolve, reject) => {

  unitModel.defaultSchema
    .findOneAndUpdate(
      {
        _id: id,
      },
      obj
  
    )
    .then(function (res) {
      resolve(res);
    })
    .catch(function (err) {
      reject(null);
    
    });
  });

};
module.exports = {
  deleteUnit: unitModel.genericSchema.delete,
  updateUnit: unitModel.genericSchema.update,
  findById: unitModel.genericSchema.findById,
  create: unitModel.genericSchema.create,
  updateUnitRateCb,
  findAll,
};
