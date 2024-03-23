const postModel = require("../models/post.model");
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
  if (req.body && req.body.userId) {
    $match.userId = new ObjectId(req.body.userId);
  }
  if (req.body && req.body.unitsIds) {
    let unitsIds = req.body.unitsIds.map((_obj) => _obj._id);
    $match.unitId = { $in: unitsIds };
  }
  if (req.body && req.body.unitId) {
    $match.unitId = new ObjectId(req.body.unitId);
  }
  postModel.defaultSchema
    .aggregate([
      {
        $match,
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "units",
          localField: "unitId",
          foreignField: "_id",
          as: "unit",
        },
      },
      {
        $unwind: {
          path: "$unit",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          description: { $first: `$description` },
          target: { $first: `$target` },
          userId: { $first: `$userId` },
          unitId: { $first: `$unitId` },
          name: { $first: `$unit.${toFound}` },
          address: { $first: `$unit.address` },
          type: { $first: `$unit.type` },
          imagesList: { $first: `$unit.imagesList` },
          rate: { $first: `$unit.rate` },
          isTrusted: { $first: `$unit.isTrusted` },
          isSeparated: { $first: `$unit.isSeparated` },
          // phone: { $first: `$user.phone` },
          // phonesList: { $first: `$user.phonesList` },
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
  deletePost: postModel.genericSchema.delete,
  updatePost: postModel.genericSchema.update,
  findById: postModel.genericSchema.findById,
  create: postModel.genericSchema.create,
  findAll,
};
