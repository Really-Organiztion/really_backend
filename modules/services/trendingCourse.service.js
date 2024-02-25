const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const trendingCourseModel = require("../models/trendingCourse.model");

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  let obj = {};
  if (req.body.subjectId) {
    obj = { ...obj, "course.subjectId": ObjectId(req.body.subjectId) };
  }
  if (req.body.gradeId) {
    obj = { ...obj, "course.gradeId": ObjectId(req.body.gradeId) };
  }
  if (req.body.educationSystemId) {
    obj = {
      ...obj,
      "course.educationSystemId": ObjectId(req.body.educationSystemId),
    };
  }
  trendingCourseModel.defaultSchema
    .aggregate([
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      {
        $unwind: {
          path: "$course",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: obj,
      },
      {
        $lookup: {
          from: "grades",
          localField: "course.gradeId",
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
          localField: "course.educationSystemId",
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
          localField: "course.subjectId",
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
          localField: "course.teacherId",
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
          courseId: { $first: "$course._id" },
          courseIcon: { $first: "$course.courseIcon" },
          courseSubject: { $first: `$subject.${toFound}` },
          coursePrice: { $first: "$course.price" },
          teacherFirstName: { $first: "$teacher.firstName" },
          teacherLastName: { $first: "$teacher.lastName" },
          teacherPersonalImage: { $first: "$teacher.personalImage" },
          gradeName: { $first: `$grade.${toFound}` },
          educationSystemName: { $first: `$educationSystem.${toFound}` },
        },
      },
    ])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ date: 1 })
    .exec((err, data) => res.json(err || data));
};

module.exports = {
  deleteTrendingCourse: trendingCourseModel.genericSchema.delete,
  updateTrendingCourse: trendingCourseModel.genericSchema.update,
  findById: trendingCourseModel.genericSchema.findById,
  create: trendingCourseModel.genericSchema.create,
  findAll,
};
