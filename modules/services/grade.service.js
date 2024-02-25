const gradeModel = require("../models/grade.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  gradeModel.defaultSchema
    .aggregate([
      {
        $lookup: {
          from: "educationsystems",
          localField: "educationSystems",
          foreignField: "_id",
          as: "educationSystems",
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: `$${toFound}` },
          educationSystems: { $first: "$educationSystems" },
        },
      },
    ])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec((err, data) => res.json(err || data));
};

findGradeByEducationSystem = (req, res, educationSystemId) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  gradeModel.defaultSchema
    .aggregate([
      {
        $match: {
          educationSystems: { $eq: ObjectId(educationSystemId) },
        },
      },
      {
        $lookup: {
          from: "educationsystems",
          localField: "educationSystems",
          foreignField: "_id",
          as: "educationSystems",
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: `$${toFound}` },
          educationSystems: { $first: "$educationSystems" },
        },
      },
    ])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec((err, data) => res.json(err || data));
};

module.exports = {
  deleteGrade: gradeModel.genericSchema.delete,
  updateGrade: gradeModel.genericSchema.update,
  findById: gradeModel.genericSchema.findById,
  create: gradeModel.genericSchema.create,
  findAll,
  findGradeByEducationSystem,
};
