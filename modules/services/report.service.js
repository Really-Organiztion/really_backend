const reportModel = require("../models/report.model");
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
  reportModel.defaultSchema
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

module.exports = {
  deleteReport: reportModel.genericSchema.delete,
  updateReport: reportModel.genericSchema.update,
  findById: reportModel.genericSchema.findById,
  create: reportModel.genericSchema.create,
  findAll,
};
