const transactionModel = require("../models/transaction.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  let where = req.body || {};

  if (!req.body || !req.body.isDeleted) {
    where["isDeleted"] = false;
  }
  if (req.body.userId) {
    where["userId"] = new ObjectId(req.body.userId);
  }
  if (req.body.currencyId) {
    where["currencyId"] = new ObjectId(req.body.currencyId);
  }

  transactionModel.defaultSchema
    .find(where)
    .sort({ _id: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .populate("currencyId", [`${toFound}`, "code", "numericCode", "color"])
    .populate("userId", ["username", "phone"])
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};
updateTransactionType = async (req, res, id) => {
  transactionModel.defaultSchema
    .findByIdAndUpdate(id, {
      $set: { type: req.body.type },
      new: true,
      setDefaultsOnInsert: true,
    })
    .then(function (data) {
      res.status(200).send(`New Type is ${req.body.type}`);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

module.exports = {
  deleteTransaction: transactionModel.genericSchema.delete,
  updateTransaction: transactionModel.genericSchema.update,
  updateTransactionType,
  findById: transactionModel.genericSchema.findById,
  create: transactionModel.genericSchema.create,
  findAll,
};
