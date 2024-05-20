const postModel = require("../models/post.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  const toFoundTitle = lang === "en" ? "title" : "titleAr";
  const toFoundDescription = lang === "en" ? "description" : "descriptionAr";
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
  if (req.body && req.body.target) {
    $match.target = req.body.target;
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
          description: { $first: `$${toFoundDescription}` },
          title: { $first: `$${toFoundTitle}` },
          plansList: { $first: `$plansList` },
          setting: { $first: `$setting` },
          target: { $first: `$target` },
          userId: { $first: `$userId` },
          unitId: { $first: `$unitId` },
          address: { $first: `$unit.address` },
          type: { $first: `$unit.type` },
          has3DView: { $first: `$unit.has3DView` },
          imagesList: { $first: `$unit.imagesList` },
          rate: { $first: `$unit.rate` },
          isTrusted: { $first: `$unit.isTrusted` },
          isSeparated: { $first: `$unit.isSeparated` },
          username: { $first: `$user.username` },
          role: { $first: `$user.role` },
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

findAllMap = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 100000;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  let $match = {};
  let match2 = {};
  if (req.body && req.body.isDeleted) {
    $match = { isDeleted: true };
  } else {
    $match = { isDeleted: false };
  }
  if (req.body && req.body.countryId) {
    match2.countryId = new ObjectId(req.body.countryId);
  }

  if (req.body && req.body.target) {
    $match.target = req.body.target;
  }
  postModel.defaultSchema
    .aggregate([
      {
        $match,
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
          area: { $first: `$unit.area` },
          unitId: { $first: `$unitId` },
          coordinates: { $first: `$unit.location.coordinates` },
          countryId: { $first: `$unit.countryId` },
          primImage: { $first: `$unit.primImage` },
          // imagesList: { $first: `$unit.imagesList` }
        },
      },
      // {$unwind:"$imagesList"},
      {
        $match: match2,
      },
      {
        $group: {
          _id: "$_id",
          area: { $first: `$area` },
          unitId: { $first: `$unitId` },
          coordinates: { $first: `$coordinates` },
          primImage: { $first: `$primImage` },
          // image: { $first: `$imagesList` }
        },
      },
    ])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};


updatePostCb = (obj, id) => {
  return new Promise((resolve, reject) => {
    postModel.defaultSchema
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
  deletePost: postModel.genericSchema.delete,
  updatePost: postModel.genericSchema.update,
  findById: postModel.genericSchema.findById,
  create: postModel.genericSchema.create,
  findAll,
  findAllMap,
  updatePostCb,
};
