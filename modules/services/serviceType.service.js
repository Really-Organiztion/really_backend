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
  serviceTypeModel.defaultSchema
    .aggregate([
      {
        $match,
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: `$${toFound}` },
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
  deleteServiceType: serviceTypeModel.genericSchema.delete,
  updateServiceType: serviceTypeModel.genericSchema.update,
  findById: serviceTypeModel.genericSchema.findById,
  create: serviceTypeModel.genericSchema.create,
  findAll,
};
