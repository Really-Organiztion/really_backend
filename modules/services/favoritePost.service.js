const favoritePostModel = require("../models/favoritePost.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  const toFoundTitle = lang === "en" ? "title" : "titleAr";
  const toFoundDescription = lang === "en" ? "description" : "descriptionAr";
  let where = req.body || {};
  if (req.body) {
    if (req.body.userId) {
      where["userId"] = new ObjectId(req.body.userId);
    }
    if (req.body.postId) {
      where["postId"] = new ObjectId(req.body.postId);
    }
  }
  favoritePostModel.defaultSchema
    .aggregate([
      {
        $match: where,
      },
      // {
      //   $match: {
      //     location: {
      //       $near: {
      //         $geometry: { type: "Point", coordinates: req.body.coordinates },
      //         $maxDistance: req.body.distance,
      //       },
      //     },
      //   },
      // },
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $unwind: {
          path: "$post",
          preserveNullAndEmptyArrays: true,
        },
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
        $group: {
          _id: "$_id",
          postId: {$first: `$post._id`},
          description: { $first: `$post.${toFoundDescription}` },
          title: { $first: `$post.${toFoundTitle}` },
          plansList: { $first: `$post.plansList` },
          status: { $first: `$post.status` },
          addtionDetails: { $first: `$post.addtionDetails` },
          setting: { $first: `$post.setting` },
          target: { $first: `$post.target` },
          userId: { $first: `$post.userId` },
          unitId: { $first: `$post.unitId` },
          // address: { $first: `$address` },
          // type: { $first: `$type` },
          // has3DView: { $first: `$has3DView` },
          // imagesList: { $first: `$imagesList` },
          // rate: { $first: `$rate` },
          // isTrusted: { $first: `$isTrusted` },
          // isSeparated: { $first: `$isSeparated` },
          // username: { $first: `$user.username` },
          // role: { $first: `$user.role` },
          // phone: { $first: `$user.phone` },
          // phonesList: { $first: `$user.phonesList` },
        },
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
          status: { $first: `$status` },
          addtionDetails: { $first: `$addtionDetails` },
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
          phone: { $first: `$user.phone` },
          phonesList: { $first: `$user.phonesList` },
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

updateFavoritePost = async (req, res, id) => {
  return new Promise((resolve, reject) => {
    favoritePostModel.defaultSchema
      .findOneAndUpdate({ _id: id }, req.body)
      .then(function (doc) {
        resolve(doc);
      })
      .catch(function (err) {
        reject(err);
        res.status(400).send(err);
      });
  });
};

deleteFavoritePost = async (req, res, id) => {
  return new Promise((resolve, reject) => {
    favoritePostModel.defaultSchema
      .findOneAndDelete({
        _id: id,
      })
      .then(function (doc) {
        resolve(doc);
      })
      .catch(function (err) {
        reject(err);
        res.status(400).send(err);
      });
  });
};

createFavoritePost = async (req, res) => {
  return new Promise((resolve, reject) => {
    favoritePostModel.defaultSchema
      .create(req.body)
      .then(function (doc) {
        resolve(doc);
      })
      .catch(function (err) {
        reject(err);
        res.status(400).send(err);
      });
  });
};

module.exports = {
  deleteFavoritePost,
  updateFavoritePost,
  findById: favoritePostModel.genericSchema.findById,
  createFavoritePost,
  findAll,
};
