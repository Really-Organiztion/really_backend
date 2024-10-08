const commentModel = require("../models/comment.model");
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
  if (req.body && req.body.unitId) {
    $match.unitId = new ObjectId(req.body.unitId);
  }
  commentModel.defaultSchema
    .aggregate([
      {
        $match,
      },
      {
        $group: {
          _id: "$_id",
          description: { $first: `$description` },
          userId: { $first: `$userId` },
          unitId: { $first: `$unitId` },
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

module.exports = {
  deleteComment: commentModel.genericSchema.delete,
  updateComment: commentModel.genericSchema.update,
  findById: commentModel.genericSchema.findById,
  create: commentModel.genericSchema.create,
  findAll,
};
