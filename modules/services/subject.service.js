const subjectModel = require("../models/subject.model");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  subjectModel.defaultSchema
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

findSubjectByEducationSystem = (req, res, educationSystemId) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  subjectModel.defaultSchema
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
  deleteSubject: subjectModel.genericSchema.delete,
  updateSubject: subjectModel.genericSchema.update,
  findById: subjectModel.genericSchema.findById,
  create: subjectModel.genericSchema.create,
  findAll,
  findSubjectByEducationSystem,
};
