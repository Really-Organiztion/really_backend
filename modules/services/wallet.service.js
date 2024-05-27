const walletModel = require("../models/wallet.model");
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

  walletModel.defaultSchema
    .find(where)
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
updateWalletStatus = async (req, res, id) => {
  walletModel.defaultSchema
    .findByIdAndUpdate(id, {
      $set: { status: req.body.status },
      new: true,
      setDefaultsOnInsert: true,
    })
    .then(function (data) {
      res.status(200).send(`New Status is ${req.body.status}`);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

module.exports = {
  deleteWallet: walletModel.genericSchema.delete,
  updateWallet: walletModel.genericSchema.update,
  updateWalletStatus,
  findById: walletModel.genericSchema.findById,
  create: walletModel.genericSchema.create,
  findAll,
};
