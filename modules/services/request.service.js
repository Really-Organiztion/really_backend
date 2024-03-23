const requestModel = require("../models/request.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  let where = req.body || {};
  if (req.body && req.body.userId) {
    where["userId"] = new ObjectId(req.body.userId);
  }
  if (req.body && req.body.details) {
    where["details"] =  { $regex: req.body["details"], $options: "i" };
  }
 

    requestModel.defaultSchema
    .find(where)
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
     .populate("userId", ["username", "phone"])
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
