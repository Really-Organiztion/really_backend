const unitModel = require("../models/unit.model");
const requestModel = require("../models/request.model");
const webSocket = require("../../helpers/websocket");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const crypto = require("crypto");

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
    if (req.body.status) {
      where["status"] = req.body.status;
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
    if (req.body.linkedByUserId) {
      where["linkedBy.userId"] = new ObjectId(req.body.linkedByUserId);
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
    .sort({ _id: -1 })
    .populate("countryId", [`${toFound}`, "code", "numericCode"])
    .populate("userId", ["username", "phone", "profileImage", "gender"])
    .populate("linkedBy.userId", [
      "username",
      "phone",
      "profileImage",
      "gender",
    ])
    // .populate("servicesId", [`${toFound}`, "subServicesList"])
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
      .populate("linkedBy.userId", [
        "username",
        "phone",
        "profileImage",
        "gender",
      ])
      // .populate("servicesId", [`${toFound}`, "subServicesList"])
      .then(function (data) {
        resolve(data);
      })
      .catch(function (err) {
        reject(null);
      });
  });
};

updateUnitCb = (obj, id) => {
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

create = async (req, res) => {
  if (req.body.location && req.body.location.coordinates) {
    req.body.location.coordinates = [req.body.location.coordinates];
  }

  unitModel.defaultSchema
    .create(req.body)
    .then(function (doc) {
      let request = {
        name: "I want to add new unit",
        nameAr: "أريد إضافة وحدة جدبدة",
        code: crypto.randomBytes(6).toString("hex"),
        type: "AddUnit",
        target: "Unit",
        userId: doc.userId,
        unitId: doc._id,
      };

      requestModel.defaultSchema
        .create(request)
        .then(function (_request) {
          webSocket.sendAdminMessage(_request, res);
          res.status(200).send(doc);
        })
        .catch(function (err) {
          res.status(400).send(err);
        });
    })
    .catch(function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};

findCoordinatesMatch = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  unitModel.defaultSchema
    .find({
      location: {
        $geoIntersects: {
          $geometry: {
            type: "Polygon",
            coordinates: [req.body.coordinates],
          },
        },
      },
    })
    .sort({ _id: -1 })
    .populate("countryId", [`${toFound}`, "code", "numericCode"])
    .populate("userId", ["username", "phone", "profileImage", "gender"])
    .populate("linkedBy.userId", [
      "username",
      "phone",
      "profileImage",
      "gender",
    ])
    // .populate("servicesId", [`${toFound}`, "subServicesList"])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .then(function (unit) {
      res.status(200).send(unit);
    })
    .catch(function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};

findNearUnitsToPosts = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  const toFoundTitle = lang === "en" ? "title" : "titleAr";
  const toFoundDescription = lang === "en" ? "description" : "descriptionAr";
   //   .find(
    //     {
    //     location: {
    //       $near: {
    //         $geometry: { type: "Point", coordinates: req.body.coordinates },
    //         $maxDistance: req.body.distance,
    //       },
    //     },
    //   }
    // )
  unitModel.defaultSchema
    .aggregate([
      {
        $geoNear: {
           near: { type: "Point", coordinates: req.body.coordinates },
           spherical: true,
           maxDistance: req.body.distance,
           distanceField: "calcDistance"
        }
     },
      // {
      //   $match: {
      //     location: {
      //       $near: {
      //         $geometry: { type: "Point", coordinates: req.body.coordinates },
      //         $maxDistance: req.body.distance,
      //       },
      //     },
      //   },
      // },
      {
        $lookup: {
          from: "posts",
          localField: "_id",
          foreignField: "unitId",
          as: "post",
        },
      },
      {
        $unwind: {
          path: "$post",
          preserveNullAndEmptyArrays: true,
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
          description: { $first: `$post.${toFoundDescription}` },
          title: { $first: `$post.${toFoundTitle}` },
          plansList: { $first: `$post.plansList` },
          status: { $first: `$post.status` },
          addtionDetails: { $first: `$post.addtionDetails` },
          setting: { $first: `$post.setting` },
          target: { $first: `$post.target` },
          userId: { $first: `$post.userId` },
          unitId: { $first: `$post.unitId` },
          address: { $first: `$address` },
          type: { $first: `$type` },
          has3DView: { $first: `$has3DView` },
          imagesList: { $first: `$imagesList` },
          rate: { $first: `$rate` },
          isTrusted: { $first: `$isTrusted` },
          primImage: { $first: `$primImage` },
          isSeparated: { $first: `$isSeparated` },
          username: { $first: `$user.username` },
          role: { $first: `$user.role` },
          // phone: { $first: `$user.phone` },
          // phonesList: { $first: `$user.phonesList` },
        },
      },
    ])
    .sort({ _id: -1 })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .then(function (unit) {
      res.status(200).send(unit);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

findNearUnits = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  unitModel.defaultSchema
    .find(
      // { location : { $near : req.body.coordinates, $maxDistance: 5510 } }
      {
        location: {
          $near: {
            $geometry: { type: "Point", coordinates: req.body.coordinates },
            $maxDistance: req.body.distance,
          },
        },
      }
    )
    .sort({ _id: -1 })
    .populate("countryId", [`${toFound}`, "code", "numericCode"])
    .populate("userId", ["username", "phone", "profileImage", "gender"])

    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .then(function (unit) {
      res.status(200).send(unit);
    })
    .catch(function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};

findById = (req, res, id) => {
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  unitModel.defaultSchema
    .findById(id)
    .populate("countryId", [`${toFound}`, "code", "numericCode"])
    .populate("userId", ["username", "phone", "profileImage", "gender"])
    .populate("linkedBy.userId", [
      "username",
      "phone",
      "profileImage",
      "gender",
    ])
    // .populate("servicesId", [`${toFound}`, "subServicesList"])
    .then(function (data) {
      res.status(200).send(data);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};

updateUnit = async (req, res, id) => {
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  unitModel.defaultSchema
    .findByIdAndUpdate(id, req.body, {
      new: true,
      setDefaultsOnInsert: true,
    })
    .populate("countryId", [`${toFound}`, "code", "numericCode"])
    .populate("userId", ["username", "phone", "profileImage", "gender"])
    .populate("linkedBy.userId", [
      "username",
      "phone",
      "profileImage",
      "gender",
    ])
    .then(function (data) {
      if (req.body.status === "UnderReview") {
        let request = {
          name: "I want to Update unit",
          nameAr: "أريد تعديل بيانات وحدة",
          code: crypto.randomBytes(6).toString("hex"),
          type: "UpdateUnit",
          target: "Unit",
          userId: data.userId,
          unitId: data._id,
        };
        requestModel.defaultSchema
          .create(request)
          .then(function (_request) {
            webSocket.sendAdminMessage(_request, res);
            res.status(200).send(data);
          })
          .catch(function (err1) {
            res.status(400).send(err1);
          });
      } else {
        console.log(data);

        res.status(200).send(data);
      }
    })
    .catch(function (err) {
      console.log(err);
      res.status(400).send(err);
    });
};

module.exports = {
  deleteUnit: unitModel.genericSchema.delete,
  updateUnit,
  findById,
  create,
  updateUnitCb,
  findAll,
  findAllFilterCb,
  findCoordinatesMatch,
  findNearUnits,
  findNearUnitsToPosts,
};
