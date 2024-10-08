const postModel = require("../models/post.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  const toFoundTitle = lang === "en" ? "title" : "titleAr";
  const toFoundDescription = lang === "en" ? "description" : "descriptionAr";
  let $match = {};
  let $match2 = {};
  if (!req.body.isDeleted) {
    $match = { isDeleted: false };
  }
  if (req.body.userId) {
    $match.userId = new ObjectId(req.body.userId);
  }
  if (req.body.unitsIds) {
    let unitsIds = req.body.unitsIds.map((_obj) => new ObjectId(_obj));
    $match.unitId = { $in: unitsIds };
  }
  if (req.body.unitId) {
    $match.unitId = new ObjectId(req.body.unitId);
  }

  if (req.body.target) {
    $match.target = { $in: req.body.targetList };
  }

  if (req.body.statusList) {
    $match.status = { $in: req.body.statusList };
  }
  if (req.body.loginUserId) {
    req.body.loginUserId = new ObjectId(req.body.loginUserId);
  }
  if (req.body["search"]) {
    $match.$or = [
      { description: { $regex: req.body["search"], $options: "i" } },
      { descriptionAr: { $regex: req.body["search"], $options: "i" } },
      { title: { $regex: req.body["search"], $options: "i" } },
      { titleAr: { $regex: req.body["search"], $options: "i" } },
    ];
  }

  if (req.body.isTrusted) {
    $match2.isTrusted = req.body.isTrusted;
  }

  if (req.body.isSeparated) {
    $match2.isSeparated = req.body.isSeparated;
  }

  if (req.body.typeList) {
    $match.type = { $in: req.body.typeList };
  }

  if (req.body.typePlansList) {
    $match["plansList.type"] = { $in: req.body.typePlansList };
  }

  if (req.body.price && req.body.priceTo) {
    $match["plansList.price"] = {
      $gte: req.body.price,
      $lte: req.body.priceTo,
    };
  } else if (req.body.price) {
    $match["plansList.price"] = req.body.price;
  }
  postModel.defaultSchema
    .aggregate([
      {
        $match,
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
        $lookup: {
          from: "units",
          localField: "unitId",
          foreignField: "_id",
          as: "unit",
        },
      },
      {
        $unwind: {
          path: "$unit",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "favoriteposts",
          let: { userId: "req?.body?.loginUserId", postId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $eq: ["$$postId", "$postId"],
                    },
                  ],
                },
              },
            },
            {
              $project: {
                unitId: 0,
                __v: 0,
              },
            },
          ],
          as: "favoritePost",
        },
      },
      {
        $unwind: {
          path: "$favoritePost",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          description: { $first: `$${toFoundDescription}` },
          title: { $first: `$${toFoundTitle}` },
          plansList: { $first: `$plansList` },
          status: { $first: `$status` },
          addtionDetails: { $first: `$addtionDetails` },
          setting: { $first: `$setting` },
          target: { $first: `$target` },
          userId: { $first: `$userId` },
          unitId: { $first: `$unitId` },
          address: { $first: `$unit.address` },
          type: { $first: `$unit.type` },
          has3DView: { $first: `$unit.has3DView` },
          imagesList: { $first: `$unit.imagesList` },
          rate: { $first: `$unit.rate` },
          isTrusted: { $first: `$unit.isTrusted` },
          isSeparated: { $first: `$unit.isSeparated` },
          firstName: { $first: `$user.firstName` },
          lastName: { $first: `$user.lastName` },
          gender: { $first: `$user.gender` },
          profileImage: { $first: `$user.profileImage` },
          phone: { $first: `$user.phone` },
          role: { $first: `$user.role` },
          primImage: { $first: `$unit.primImage` },
          favoritePost: { $first: `$favoritePost._id` },
          // phone: { $first: `$user.phone` },
          // phonesList: { $first: `$user.phonesList` },
        },
      },
      {
        $match: $match2,
      },

      {
        $group: {
          _id: "$_id",
          description: { $first: `$${toFoundDescription}` },
          title: { $first: `$${toFoundTitle}` },
          plansList: { $first: `$plansList` },
          status: { $first: `$status` },
          addtionDetails: { $first: `$addtionDetails` },
          setting: { $first: `$setting` },
          target: { $first: `$target` },
          userId: { $first: `$userId` },
          unitId: { $first: `$unitId` },
          address: { $first: `$address` },
          type: { $first: `$type` },
          favoritePost: { $first: `$favoritePost` },
          has3DView: { $first: `$has3DView` },
          imagesList: { $first: `$imagesList` },
          rate: { $first: `$rate` },
          isTrusted: { $first: `$isTrusted` },
          primImage: { $first: `$primImage` },
          isSeparated: { $first: `$isSeparated` },
          firstName: { $first: `$firstName` },
          lastName: { $first: `$lastName` },
          gender: { $first: `$gender` },
          profileImage: { $first: `$profileImage` },
          phone: { $first: `$phone` },
          role: { $first: `$role` },
          // phone: { $first: `$user.phone` },
          // phonesList: { $first: `$user.phonesList` },
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

findAllMap = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 100000;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  let $match = {};
  let match2 = {};
  if (req.body && req.body.isDeleted) {
    $match = { isDeleted: true };
  } else {
    $match = { isDeleted: false };
  }
  if (req.body && req.body.countryId) {
    match2.countryId = new ObjectId(req.body.countryId);
  }

  if (req.body && req.body.target) {
    $match.target = req.body.target;
  }
  postModel.defaultSchema
    .aggregate([
      {
        $match,
      },
      {
        $lookup: {
          from: "units",
          localField: "unitId",
          foreignField: "_id",
          as: "unit",
        },
      },
      {
        $unwind: {
          path: "$unit",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          area: { $first: `$unit.area` },
          unitId: { $first: `$unitId` },
          coordinates: { $first: `$unit.location.coordinates` },
          countryId: { $first: `$unit.countryId` },
          primImage: { $first: `$unit.primImage` },
          // imagesList: { $first: `$unit.imagesList` }
        },
      },
      // {$unwind:"$imagesList"},
      {
        $match: match2,
      },
      {
        $group: {
          _id: "$_id",
          area: { $first: `$area` },
          unitId: { $first: `$unitId` },
          coordinates: { $first: `$coordinates` },
          primImage: { $first: `$primImage` },
          // image: { $first: `$imagesList` }
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
      console.log(err);
      res.status(400).send(err);
    });
};
create = async (req, res) => {
  return new Promise((resolve, reject) => {
    postModel.defaultSchema
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
updatePostCb = (obj, id) => {
  return new Promise((resolve, reject) => {
    postModel.defaultSchema
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

findById = (req, res, id) => {
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  const toFoundTitle = lang === "en" ? "title" : "titleAr";
  const toFoundDescription = lang === "en" ? "description" : "descriptionAr";
  let $group = {
    _id: "$_id",
    description: { $first: `$${toFoundDescription}` },
    title: { $first: `$${toFoundTitle}` },
    plansList: { $first: `$plansList` },
    status: { $first: `$status` },
    addtionDetails: { $first: `$addtionDetails` },
    setting: { $first: `$setting` },
    target: { $first: `$target` },
    userId: { $first: `$userId` },
    unitId: { $first: `$unitId` },
    address: { $first: `$unit.address` },
    type: { $first: `$unit.type` },
    has3DView: { $first: `$unit.has3DView` },
    imagesList: { $first: `$unit.imagesList` },
    rate: { $first: `$unit.rate` },
    isTrusted: { $first: `$unit.isTrusted` },
    primImage: { $first: `$unit.primImage` },
    isSeparated: { $first: `$unit.isSeparated` },
    firstName: { $first: `$user.firstName` },
    lastName: { $first: `$user.lastName` },
    gender: { $first: `$user.gender` },
    profileImage: { $first: `$user.profileImage` },
    phone: { $first: `$user.phone` },
    role: { $first: `$user.role` },
    // phone: { $first: `$user.phone` },
    // phonesList: { $first: `$user.phonesList` },
  };

  if (!req.query.lang) {
    $group["descriptionAr"] = { $first: `$descriptionAr` };
    $group["titleAr"] = { $first: `$titleAr` };
  }

  postModel.defaultSchema
    .aggregate([
      {
        $match: {
          _id: new ObjectId(id),
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
        $lookup: {
          from: "units",
          localField: "unitId",
          foreignField: "_id",
          as: "unit",
        },
      },
      {
        $unwind: {
          path: "$unit",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group,
      },
    ])
    .then(function (data) {
      res.status(200).send(data[0]);
    })
    .catch(function (err) {
      res.status(400).send(err);
    });
};
deletePost = async (req, res, id) => {
  return new Promise((resolve, reject) => {
    postModel.defaultSchema
      .findByIdAndUpdate(id, {
        isDeleted: true,
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
module.exports = {
  deletePost,
  updatePost: postModel.genericSchema.update,
  findById,
  create,
  findAll,
  findAllMap,
  updatePostCb,
};
