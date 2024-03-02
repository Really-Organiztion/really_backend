const requestModel = require("../models/request.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  // let $match = {};
  // if (req.body && req.body.userId) {
  //   $match = { userId };
  // }
  // requestModel.defaultSchema
  //   .aggregate([
  //     {
  //       $match,
  //     },
  //     {
  //       $lookup: {
  //         from: "users",
  //         localField: "userId",
  //         foreignField: "_id",
  //         as: "user",
  //       },
  //     },
  //     {
  //       $unwind: {
  //         path: "$user",
  //         preserveNullAndEmptyArrays: true,
  //       },
  //     },
  //     {
  //       $project: {
  //         details: 1,
  //         numericCode: 1,
  //         code: 1,
  //         currencyId: 1,
  //         currency: 1,
  //         timezones: 1,
  //         latitude: 1,
  //         longitude: 1,
  //         flag: 1,
  //       },
  //     },
  //     {
  //       $group: {
  //         _id: "$_id",
  //         details: { $first: `$details` },
  //         name: { $first: `$${toFound}` },
  //         code: { $first: `$code` },
  //         userId: { $first: `$userId` },
  //         userName: { $first: `$user.${toFound}` },
  //         timezones: { $first: `$timezones` },
  //         latitude: { $first: `$latitude` },
  //         longitude: { $first: `$longitude` },
  //         flag: { $first: `$flag` },
  //       },
  //     },
  //   ])
  //   .skip((pageNumber - 1) * pageSize)
  //   .limit(pageSize)
  //   .then(function (data) {
  //     res.status(200).send(data);
  //   })
  //   .catch(function (err) {
  //     res.status(400).send(err);
  //   });

    requestModel.defaultSchema
    .find(req.body)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    // .populate("userId", ["username", "phone"])
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

deleteRequest = async (req, res, id) => {
  requestModel.defaultSchema
    .deleteOne({
      _id: id,
    })
    .then(function (data) {
      res.status(200).send("Deleted successfully");
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

deleteAllRequest = async (req, res, userId) => {
  requestModel.defaultSchema
    .deleteMany({
      userId,
    })
    .then(function (data) {
      res.status(200).send("Deleted successfully");
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

module.exports = {
  deleteRequest,
  deleteAllRequest,
  updateRequest: requestModel.genericSchema.update,
  findById: requestModel.genericSchema.findById,
  create: requestModel.genericSchema.create,
  findAll,
};
