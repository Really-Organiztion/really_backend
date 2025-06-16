const termsModel = require("../models/terms.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? parseInt(req.query.pageNumber) : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang || "En";
  req.body = req.body || {};

  let $match = {};
  if (req.body.isDeleted) {
    $match.isDeleted = true;
  } else {
    $match.isDeleted = false;
  }

  if (req.body.type) {
    $match.type = req.body.type;
  }

  if (req.body.typeList) {
    $match.type = { $in: req.body.typeList };
  }

  if (req.body.search) {
    $match.$or = [
      {
        nameLangList: {
          $elemMatch: {
            language: lang,
            name: { $regex: req.body.search, $options: "i" },
          },
        },
      },
      {
        type: { $regex: req.body.search, $options: "i" },
      },
    ];
  }

  let $addFields = {
    localizedName: {
      $let: {
        vars: {
          matchedLang: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$nameLangList",
                  as: "item",
                  cond: { $eq: ["$$item.language", lang] },
                },
              },
              0,
            ],
          },
        },
        in: "$$matchedLang.name",
      },
    },
  };

  let $group = {
    _id: "$_id",
    name: { $first: "$localizedName" },
    type: { $first: "$type" },
    dateTime: { $first: "$dateTime" },
    version: { $first: "$version" },
    createdAt: { $first: "$createdAt" },
    updatedAt: { $first: "$updatedAt" },
    isDeleted: { $first: "$isDeleted" },
  };

  termsModel.defaultSchema
    .aggregate([
      { $match },
      { $addFields },
      { $group },
      { $sort: { _id: -1 } },
      { $skip: (pageNumber - 1) * pageSize },
      { $limit: pageSize },
    ])
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
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
