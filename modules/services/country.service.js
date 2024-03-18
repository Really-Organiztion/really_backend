const countryModel = require("../models/country.model");
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
  let $group = {
    _id: "$_id",
    name: { $first: `$${toFound}` },
    numericCode: { $first: `$numericCode` },
    code: { $first: `$code` },
    currencyId: { $first: `$currencyId` },
    currencyName: { $first: `$currency.${toFound}` },
    timezones: { $first: `$timezones` },
    latitude: { $first: `$latitude` },
    longitude: { $first: `$longitude` },
    flag: { $first: `$flag` },
  };
  if (!req.query.lang) {
    $group["nameAr"] = { $first: `$nameAr` };
    $group["currencyNameAr"] = { $first: `$currency.nameAr` };
  }
  countryModel.defaultSchema
    .aggregate([
      {
        $match,
      },
      {
        $lookup: {
          from: "currencies",
          localField: "currencyId",
          foreignField: "_id",
          as: "currency",
        },
      },
      {
        $unwind: {
          path: "$currency",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          name: 1,
          nameAr: 1,
          numericCode: 1,
          code: 1,
          currencyId: 1,
          currency: 1,
          timezones: 1,
          latitude: 1,
          longitude: 1,
          flag: 1,
        },
      },
      {
        $group,
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
  deleteCountry: countryModel.genericSchema.delete,
  deleteReturn: countryModel.genericSchema.deleteReturn,
  updateCountry: countryModel.genericSchema.update,
  findById: countryModel.genericSchema.findById,
  create: countryModel.genericSchema.create,
  findAll,
};
