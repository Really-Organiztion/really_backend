const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const giftCardModel = require("../models/giftCard.model");

findAll = (req, res, type) => {
  return new Promise((resolve, reject) => {
    const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    const lang = req.query.lang ? req.query.lang : "en";
    const toFound = lang === "en" ? "name" : "nameAr";
    let obj = {};
    if (req.body.subjectId) {
      obj = { ...obj, subjectId: ObjectId(req.body.subjectId) };
    }
    if (req.body.gradeId) {
      obj = { ...obj, gradeId: ObjectId(req.body.gradeId) };
    }
    if (req.body.educationSystemId) {
      obj = {
        ...obj,
        educationSystemId: ObjectId(req.body.educationSystemId),
      };
    }
    giftCardModel.defaultSchema
      .aggregate([
        {
          $match: obj,
        },
        {
          $lookup: {
            from: "grades",
            localField: "gradeId",
            foreignField: "_id",
            as: "grade",
          },
        },
        {
          $unwind: {
            path: "$grade",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "educationsystems",
            localField: "educationSystemId",
            foreignField: "_id",
            as: "educationSystem",
          },
        },
        {
          $unwind: {
            path: "$educationSystem",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "subjects",
            localField: "subjectId",
            foreignField: "_id",
            as: "subject",
          },
        },
        {
          $unwind: {
            path: "$subject",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "teachers",
            localField: "teacherId",
            foreignField: "_id",
            as: "teacher",
          },
        },
        {
          $unwind: {
            path: "$teacher",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: "$_id",
            price: { $first: "$price" },
            type: { $first: "$type" },
            expiryDate: { $first: "$expiryDate" },
            gradeId: { $first: "$gradeId" },
            grade: { $first: `$grade.${toFound}` },
            educationSystemId: { $first: "$educationSystemId" },
            educationSystem: { $first: `$educationSystem.${toFound}` },
            subjectId: { $first: "$subjectId" },
            subjectName: { $first: `$subject.${toFound}` },
            teacherId: { $first: "$teacherId" },
            teacherFirstName: { $first: "$teacher.firstName" },
            teacherLastName: { $first: "$teacher.lastName" },
            teacherPersonalImage: { $first: "$teacher.personalImage" },
          },
        },
      ])
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec((err, data) => {
        if (err) res.status(500).send(err);
        else {
          if (type === "other") {
            resolve(data);
          } else {
            res.status(200).send(data);
          }
        }
      });
  });
};

module.exports = {
  deleteGiftCard: giftCardModel.genericSchema.delete,
  updateGiftCard: giftCardModel.genericSchema.update,
  findById: giftCardModel.genericSchema.findById,
  create: giftCardModel.genericSchema.create,
  findAll,
};
