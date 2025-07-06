const transactionModel = require("../models/transaction.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const axios = require("axios");
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

  if (req.body.statusList && req.body.statusList.length > 0) {
    where.status = { $in: req.body.statusList };
    delete req.body.statusList;
  }

    if (req.body.typeList && req.body.typeList.length > 0) {
    where.type = { $in: req.body.typeList };
    delete req.body.typeList;
  }

  transactionModel.defaultSchema
    .find(where)
    .sort({ _id: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    // .populate("currencyId", [`${toFound}`, "code", "numericCode", "color"])
    // .populate("userId", ["username", "phone"])
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
thawaniSession = async (transaction,is_test) => {
  return new Promise(async (resolve, reject) => {
    try {
      let url = "https://checkout.thawani.om/api/v1/checkout/session";
      let api_key = process.env.THAWANI_API_KEY
      if(is_test) {
        url = "https://uatcheckout.thawani.om/api/v1/checkout/session"
        api_key = process.env.THAWANI_TEST_API_KEY
      }
      console.log(is_test , api_key);
      
      const thawaniResponse = await axios.get(
        `${url}/${transaction.sessionData.session_id}`,
        {
          headers: {
            Accept: "application/json",
            "thawani-api-key": api_key,
            "Content-Type": "application/json",
          },
        }
      );

      if (thawaniResponse?.data) {
        resolve({ doc: thawaniResponse.data, done: true });
      } else {
        resolve({ error: "Transacion not found in thawani", done: false });
      }
    } catch (error) {
      resolve({ error: "Transacion not found in thawani", done: false });
    }
  });
};

create = async (req, session = null) => {
  if (req.body) {
    if (req.body.status === "Processing") {
      if (req.body?.sessionData?.success) {
        req.body.status = "Completed";
      } else {
        req.body.status = "Error";
      }
    }
  }

  const transaction = new transactionModel.defaultSchema(req.body);
  return await transaction.save({ session });
};

findOne = (where) => {
  return new Promise((resolve, reject) => {
    transactionModel.defaultSchema
      .findOne(where)
      .then(function (res) {
        resolve(res);
      })
      .catch(function (err) {
        reject(null);
      });
  });
};

deleteCb = (id) => {
  return new Promise((resolve, reject) => {
    transactionModel.defaultSchema
      .deleteOne({
        _id: id,
      })
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
      .findOneAndUpdate(id, obj, {
        new: true,
        setDefaultsOnInsert: true,
      })
      .then(function (res) {
        resolve(res);
      })
      .catch(function (err) {
        reject(null);
      });
  });
};

module.exports = {
  deleteCb,
  deleteTransaction: transactionModel.genericSchema.delete,
  updateTransaction: transactionModel.genericSchema.update,
  updateTransactionStatus,
  findById: transactionModel.genericSchema.findById,
  create,
  findOne,
  updateCb,
  findAll,
  thawaniSession,
};
