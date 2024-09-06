const rateModel = require("../models/rate.model");
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
    if (req.body.unitId) {
      where["unitId"] = new ObjectId(req.body.unitId);
    }
  }

  rateModel.defaultSchema
    .aggregate([
      {
        $match: where,
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
          value: { $first: `$value` },
          userId: { $first: `$user._id` },
          firstName: { $first: `$user.firstName` },
          lastName: { $first: `$user.lastName` },
          gender: { $first: `$user.gender` },
          profileImage: { $first: `$user.profileImage` },
          phone: { $first: `$user.phone` },
          role: { $first: `$user.role` },
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

findAllWithComments = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  let where = req.body || {};
  if (req.body) {
    if (req.body.userId) {
      where["userId"] = new ObjectId(req.body.userId);
    }
    if (req.body.unitId) {
      where["unitId"] = new ObjectId(req.body.unitId);
    }
  }
  rateModel.defaultSchema
    .aggregate([
      {
        $match: where,
      },
      {
        $lookup: {
          from: "comments",
        
          let: {userId: "$userId", unitId: "$unitId"},
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$isDeleted', false] },
                    {

                    $eq: [
                      "$$unitId",
                      "$unitId"
                    ]
                  }
                ]
                }
              }
            },
            {
              $project: {
                userId: 0,
                unitId: 0,
                isDeleted: 0,
                __v: 0,
              },
            },
          ],
          as: "comment",
        
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
          value: { $first: `$value` },
          commentList: { $first: `$comment` },
          userId: { $first: `$user._id` },
          firstName: { $first: `$user.firstName` },
          lastName: { $first: `$user.lastName` },
          gender: { $first: `$user.gender` },
          profileImage: { $first: `$user.profileImage` },
          phone: { $first: `$user.phone` },
          role: { $first: `$user.role` },
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

findByIdCb = async (req, res, id) => {
  return new Promise((resolve, reject) => {
    rateModel.defaultSchema
      .findById(id)
      .then(function (doc) {
        resolve(doc);
      })
      .catch(function (err) {
        reject(err);
        res.status(400).send(err);
      });
  });
};

updateRate = async (req, res, id) => {
  return new Promise((resolve, reject) => {
    rateModel.defaultSchema
      .findByIdAndUpdate({ _id: id }, req.body,{ returnOriginal: false },)
      .then(function (doc) {
        resolve(doc);
      })
      .catch(function (err) {
        reject(err);
        res.status(400).send(err);
      });
  });
};

deleteRate = async (req, res, id) => {
  return new Promise((resolve, reject) => {
    rateModel.defaultSchema
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

createRate = async (req, res) => {
  return new Promise((resolve, reject) => {
    rateModel.defaultSchema
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
  deleteRate,
  updateRate,
  findById: rateModel.genericSchema.findById,
  findByIdCb,
  createRate,
  findAll,
  findAllWithComments,
};
