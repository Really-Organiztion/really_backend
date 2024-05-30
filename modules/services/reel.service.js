const reelModel = require("../models/reel.model");
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
      { caption: { $regex: req.body["search"], $options: "i" } },
      { link: { $regex: req.body["search"], $options: "i" } },
    ];
  }
  if (req.body.userId) {
    $match["userId"] = new ObjectId(req.body.userId);
  }
  let $group = {
    _id: "$_id",
    userId: { $first: `$userId` },
    username: { $first: `$user.username` },
    phone: { $first: `$user.phone` },
    profileImage: { $first: `$user.profileImage` },
    imagesList: { $first: `$imagesList` },
    video: { $first: `$video` },
    link: { $first: `$link` },
    caption: { $first: `$caption` },
    views: { $first: `$views` },
    likes: { $first: `$likes` },
  };

  reelModel.defaultSchema
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
updateReelCb = (obj, id) => {
  return new Promise((resolve, reject) => {
    reelModel.defaultSchema
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
  deleteReel: reelModel.genericSchema.delete,
  deleteReturn: reelModel.genericSchema.deleteReturn,
  updateReel: reelModel.genericSchema.update,
  findById: reelModel.genericSchema.findById,
  create: reelModel.genericSchema.create,
  updateReelCb,
  findAll,
};
