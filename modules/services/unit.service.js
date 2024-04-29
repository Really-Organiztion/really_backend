const unitModel = require("../models/unit.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  let where = req.body || {};
  if (req.body) {
    if (req.body.isDeleted) {
      where = { isDeleted: true };
    } else {
      where = { isDeleted: false };
    }
    if (req.body.userId) {
      where["userId"] = new ObjectId(req.body.userId);
    }
    if (req.body.unitId) {
      where["parentsId"] = new ObjectId(req.body.unitId);
    }
    if (req.body.countryId) {
      where["countryId"] = new ObjectId(req.body.countryId);
    }
  } else {
    where = { isDeleted: false };
  }

  if (where["search"]) {
    where.$or = [
      // { name: { $regex: where["search"], $options: "i" } },
      // { nameAr: { $regex: where["search"], $options: "i" } },
      { targetType: { $regex: where["search"], $options: "i" } },
      { area: { $regex: where["search"], $options: "i" } },
      { address: { $regex: where["search"], $options: "i" } },
      { type: { $regex: where["search"], $options: "i" } },
      { gLocationLink: { $regex: where["search"], $options: "i" } },
      { additionsServices: { $regex: where["search"], $options: "i" } },
    ];
    delete where["search"];
  }

  unitModel.defaultSchema
    .find(where)
    .populate("countryId", [`${toFound}`, "code", "numericCode"])
    .populate("userId", ["username", "phone", "profileImage"])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

findAllFilterCb = (req, res) => {
  return new Promise((resolve, reject) => {
    let where = {};
    if (req.body) {
      if (req.body.isDeleted) {
        where = { isDeleted: true };
      } else {
        where = { isDeleted: false };
      }
      if (req.body.isTrusted) {
        where["isTrusted"] = true;
      }
      if (req.body.isSeparated) {
        where["isSeparated"] = true;
      }
      if (req.body.targetType) {
        where["targetType"] = req.body.targetType;
      }
    }
    if (req.body.search) {
      where.$or = [
        // { name: { $regex: req.body.search, $options: "i" } },
        // { nameAr: { $regex: req.body.search, $options: "i" } },
        { address: { $regex: req.body.search, $options: "i" } },
        { additionsServices: { $regex: req.body.search, $options: "i" } },
      ];
    }

    unitModel.defaultSchema
      .find(where, { _id: 1 })
      .then(function (data) {
        resolve(data);
      })
      .catch(function (err) {
        reject(null);
      });
  });
};

updateUnitRateCb = (obj, id) => {
  return new Promise((resolve, reject) => {
    unitModel.defaultSchema
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
  deleteUnit: unitModel.genericSchema.delete,
  updateUnit: unitModel.genericSchema.update,
  findById: unitModel.genericSchema.findById,
  create: unitModel.genericSchema.create,
  updateUnitRateCb,
  findAll,
  findAllFilterCb,
};
