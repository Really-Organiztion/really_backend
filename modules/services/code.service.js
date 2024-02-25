const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const crypto = require("crypto");
const codeModel = require("../models/code.model");

createCodes = (req, res) => {
  req.body.codes = new Array(req.body.numberOfCodes)
    .fill(crypto.randomBytes(6).toString("hex"))
    .map((e, i) => {
      return { code: crypto.randomBytes(6).toString("hex"), isUsed: false };
    });
  codeModel.defaultSchema.create(req.body, function (err, result) {
    if (err) res.status(500).send(err);
    else res.status(201).send(result);
  });
};
findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  codeModel.defaultSchema
    .aggregate([
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
          from: "lessons",
          localField: "codeLessons",
          foreignField: "_id",
          as: "lessons",
        },
      },
      {
        $group: {
          _id: "$_id",
          date: { $first: "$date" },
          courseId: { $first: "$courseId" },
          subjectId: { $first: "$subjectId" },
          subject: { $first: `$subject.${toFound}` },
          teacherId: { $first: "$teacherId" },
          teacherFirstName: { $first: "$teacher.firstName" },
          teacherLastName: { $first: "$teacher.lastName" },
          teacherPersonalImage: { $first: "$teacher.personalImage" },
          gradeId: { $first: "$gradeId" },
          grade: { $first: `$grade.${toFound}` },
          educationSystemId: { $first: "$educationSystemId" },
          educationSystem: { $first: `$educationSystem.${toFound}` },
          codeLessons: { $first: "$codeLessons" },
          lessons: { $first: "$lessons" },
          numberOfCodes: { $first: "$numberOfCodes" },
          codes: { $first: "$codes" },
        },
      },
      { $sort: { date: -1 } },
    ])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec((err, data) => {
      if (err) res.status(500).send(err);
      else res.status(200).send(data);
    });
};

checkCode = (req, res) => {
  return new Promise((resolve, reject) => {
    codeModel.defaultSchema
      .findOne({
        codes: { $elemMatch: { code: req.body.code, isUsed: false } },
      })
      .select({ __v: 0 })
      .sort({ date: -1 })
      .exec((err, data) => {
        if (err) res.status(500).send(err);
        else {
          if (data) resolve(data);
          else res.status(404).send("Not Found");
        }
      });
  });
};
updateCheckedCode = (req, res, id) => {
  codeModel.defaultSchema
    .findOneAndUpdate(
      {
        _id: ObjectId(id),
        "codes.code": req.body.code,
      },
      { $set: { "codes.$.isUsed": true } },
      {
        // While Update: show last updated document with new values
        new: true,
        // While Update: the default values will inserted without passing values explicitly
        setDefaultsOnInsert: true,
      }
    )
    .select({ courseId: 1 })
    .exec((err, data) => {
      if (err) res.status(500).send(err);
      else res.status(200).send(data);
    });
};
module.exports = {
  deleteCode: codeModel.genericSchema.delete,
  updateCode: codeModel.genericSchema.update,
  findById: codeModel.genericSchema.findById,
  create: createCodes,
  findAll,
  checkCode,
  updateCheckedCode,
};
