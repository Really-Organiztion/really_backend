const favoritePostModel = require("../models/favoritePost.model");
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
    if (req.body.postId) {
      where["postId"] = new ObjectId(req.body.postId);
    }
  }
  favoritePostModel.defaultSchema
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
