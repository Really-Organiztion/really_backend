const likeReelModel = require("../models/likeReel.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  let where = req.body || {};
  if (req.body) {
   
    if (req.body.userId) {
      where["userId"] = new ObjectId(req.body.userId);
    }
    if (req.body.reelId) {
      where["reelId"] = new ObjectId(req.body.reelId);
    }
  }
  likeReelModel.defaultSchema
  .find(where)
  .sort({ _id: -1 })
  .populate("userId", ["username", "profileImage"])
  .skip((pageNumber - 1) * pageSize)
  .limit(pageSize)
  .then(function (data) {
    res.status(200).send(data);
  })
  .catch(function (err) {
    res.status(400).send(err);
  });
};

updateLikeReel = async (req, res, id) => {
  return new Promise((resolve, reject) => {
    likeReelModel.defaultSchema
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

deleteLikeReel = async (req, res, id) => {
  return new Promise((resolve, reject) => {
    likeReelModel.defaultSchema
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

createLikeReel = async (req, res) => {
  return new Promise((resolve, reject) => {
    likeReelModel.defaultSchema
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
  deleteLikeReel,
  updateLikeReel,
  findById: likeReelModel.genericSchema.findById,
  createLikeReel,
  findAll,
};
