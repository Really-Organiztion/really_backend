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
updateTransactionStatus = async (req, res, id) => {
  let set = {};

  if (req.body.type) {
    set["type"] = { type: req.body.type };
  } else if (req.body.status) {
    if (req.body.status == "Processing") {
      if (req.body?.sessionData?.success) {
        set["status"] = "Completed";
      } else {
        set["status"] = "Error";
      }
    } else {
      set["status"] = req.body.status;
    }
  }
  transactionModel.defaultSchema
    .findByIdAndUpdate(id, {
      $set: { type: req.body.type },
      new: true,
      setDefaultsOnInsert: true,
    })
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

create = async (req, res) => {
  return new Promise((resolve, reject) => {
    if(req.body){
      if(req.body.status == 'Processing'){
        if (req.body?.sessionData?.success) {
          req.body.status = "Completed";
        } else {
          req.body.status = "Error";
        }
      }
    }
    transactionModel.defaultSchema
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

findOne = (where) => {
  return new Promise((resolve, reject) => {
    transactionModel.defaultSchema
      .findOne(
        where
        
      )
      .then(function (res) {
        resolve(res);
      })
      .catch(function (err) {
        reject(null);
      });
  });
};

updateCb = (obj, id) => {
  return new Promise((resolve, reject) => {
    transactionModel.defaultSchema
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
  deleteTransaction: transactionModel.genericSchema.delete,
  updateTransaction: transactionModel.genericSchema.update,
  updateTransactionStatus,
  findById: transactionModel.genericSchema.findById,
  create,
  findOne,
  updateCb,
  findAll,
};
