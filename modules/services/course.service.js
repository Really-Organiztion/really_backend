const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const courseModel = require("../models/course.model");
const handleFiles = require("../../helpers/handleFiles");
const attachmentPath = require("../../helpers/attachmentPath.json");
const path = attachmentPath.attachments.courseAttachmentPath;

findAll = (req, res) => {
  let obj = { isDeleted: req.body.isDeleted };
  callCourseAggregateFunc(req, res, obj, "default");
};
findTeacherCoursesByTeacherId = async (req, res, id) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  courseModel.defaultSchema
    .aggregate([
      {
        $match: { teacherId: ObjectId(id) },
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
        $group: {
          _id: "$_id",
          subjectId: { $first: "$subjectId" },
          date: { $first: "$date" },
          subject: { $first: `$subject.${toFound}` },
          gradeId: { $first: "$gradeId" },
          price: { $first: "$price" },
          educationSystemId: { $first: "$educationSystemId" },
          exclusive: { $first: "$exclusive" },
          courseIcon: { $first: "$courseIcon" },
          courseIntro: { $first: "$courseIntro" },
          teacherId: { $first: "$teacherId" },
          timeNow: { $first: Date.now() },
        },
      },
      { $sort: { date: -1 } },
    ])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec((err, data) => res.json(err || data));
};
findCourseById = (req, res, id) => {
  let obj = {
    _id: ObjectId(id),
  };
  callCourseAggregateFunc(req, res, obj, "default");
};
findUserCourseById = (req, res, id) => {
  let obj = {
    _id: ObjectId(id),
  };
  return callCourseAggregateFunc(req, res, obj, "user");
};
createWithAttachment = async (req, res) => {
  if (req.body.courseIcon) {
    try {
      req.body.courseIcon = await handleFiles.saveFiles(
        req.body.courseIcon,
        "CourseIcon",
        path
      );
    } catch (error) {
      return res.status(400).send(error);
    }
  }
  courseModel.defaultSchema.create(req.body, function (err, cat) {
    if (err) res.status(400).send(err);
    else res.status(201).send(req.body);
  });
};
callCourseAggregateFunc = (req, res, obj, type) => {
  return new Promise((resolve, reject) => {
    const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    const lang = req.query.lang ? req.query.lang : "en";
    const toFound = lang === "en" ? "name" : "nameAr";
    courseModel.defaultSchema
      .aggregate([
        {
          $match: obj,
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
            from: "chapters",
            localField: "_id",
            foreignField: "courseId",
            as: "chapters",
          },
        },
        {
          $unwind: {
            path: "$chapters",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $lookup: {
            from: "lessons",
            localField: "chapters._id",
            foreignField: "chapterId",
            as: "chapters.lessons",
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
          $project: {
            subjectId: 1,
            subject: 1,
            gradeId: 1,
            price: 1,
            date: 1,
            exclusive: 1,
            educationSystemId: 1,
            courseIcon: 1,
            courseIntro: 1,
            teacherId: 1,
            chapters: 1,
            grade: 1,
            educationSystem: 1,
            teacher: 1,
            allLessonsCount: { $size: "$chapters.lessons" },
          },
        },
        {
          $group: {
            _id: "$_id",
            subjectId: { $first: "$subjectId" },
            date: { $first: "$date" },
            subject: { $first: `$subject.${toFound}` },
            gradeId: { $first: "$gradeId" },
            grade: { $first: `$grade.${toFound}` },
            price: { $first: "$price" },
            educationSystemId: { $first: "$educationSystemId" },
            educationSystem: { $first: `$educationSystem.${toFound}` },
            exclusive: { $first: "$exclusive" },
            courseIcon: { $first: "$courseIcon" },
            courseIntro: { $first: "$courseIntro" },
            teacherId: { $first: "$teacherId" },
            teacherFirstName: { $first: "$teacher.firstName" },
            teacherLastName: { $first: "$teacher.lastName" },
            teacherPersonalImage: { $first: "$teacher.personalImage" },
            teacherBio: { $first: "$teacher.bio" },
            chapters: { $push: "$chapters" },
            lessonsCount: { $sum: "$allLessonsCount" },
            timeNow: { $first: Date.now() },
          },
        },
        { $sort: { date: -1, chapters: 1 } },
      ])
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .exec((err, data) => {
        if (err) res.status(400).send(err);
        else {
          if (type === "user") {
            resolve(data);
          } else {
            res.status(200).send(data);
          }
        }
      });
  });
};
callCourseAnotherAggregateFunc = (req, res, obj) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  if (req.body.subjectId) {
    req.body.subjectId = ObjectId(req.body.subjectId);
  }
  if (req.body.gradeId) {
    req.body.gradeId = ObjectId(req.body.gradeId);
  }
  if (req.body.educationSystemId) {
    req.body.educationSystemId = ObjectId(req.body.educationSystemId);
  }
  let newObj = { ...obj, ...req.body };
  courseModel.defaultSchema
    .aggregate([
      {
        $match: newObj,
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
        $project: {
          subjectId: 1,
          subject: 1,
          price: 1,
          date: 1,
          exclusive: 1,
          courseIcon: 1,
          courseIntro: 1,
          teacherId: 1,
          teacher: 1,
        },
      },
      {
        $group: {
          _id: "$_id",
          subjectId: { $first: "$subjectId" },
          date: { $first: "$date" },
          subjectName: { $first: `$subject.${toFound}` },
          price: { $first: "$price" },
          exclusive: { $first: "$exclusive" },
          courseIcon: { $first: "$courseIcon" },
          courseIntro: { $first: "$courseIntro" },
          teacherId: { $first: "$teacherId" },
          teacherFirstName: { $first: "$teacher.firstName" },
          teacherLastName: { $first: "$teacher.lastName" },
          teacherPersonalImage: { $first: "$teacher.personalImage" },
          timeNow: { $first: Date.now() },
        },
      },
      { $sort: { date: -1 } },
    ])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec((err, data) => res.json(err || data));
};
getNewReleasesCourses = async (req, res) => {
  let obj = { isDeleted: false };
  callCourseAnotherAggregateFunc(req, res, obj);
};
getExclusiveCourses = async (req, res, id) => {
  let obj = { isDeleted: false, exclusive: true };
  callCourseAnotherAggregateFunc(req, res, obj);
};
getUserCourses = async (req, res) => {
  if (req.body.courses && req.body.courses.length > 0) {
    let result = req.body.courses.map((course) => ObjectId(course));
    let obj = {
      _id: { $in: result },
    };
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
    findCourseBasicInfo(req, res, obj);
  }
};
findCourseBasicInfo = async (req, res, obj) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  courseModel.defaultSchema
    .aggregate([
      {
        $match: obj,
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
          from: "chapters",
          localField: "_id",
          foreignField: "courseId",
          as: "chapters",
        },
      },
      {
        $unwind: {
          path: "$chapters",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "lessons",
          localField: "chapters._id",
          foreignField: "chapterId",
          as: "chapters.lessons",
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
        $project: {
          subjectId: 1,
          subject: 1,
          gradeId: 1,
          price: 1,
          date: 1,
          exclusive: 1,
          educationSystemId: 1,
          courseIcon: 1,
          courseIntro: 1,
          teacherId: 1,
          chapters: 1,
          teacher: 1,
          allLessonsCount: { $size: "$chapters.lessons" },
        },
      },
      {
        $group: {
          _id: "$_id",
          subjectId: { $first: "$subjectId" },
          subject: { $first: `$subject.${toFound}` },
          date: { $first: "$date" },
          gradeId: { $first: "$gradeId" },
          price: { $first: "$price" },
          educationSystemId: { $first: "$educationSystemId" },
          exclusive: { $first: "$exclusive" },
          courseIcon: { $first: "$courseIcon" },
          courseIntro: { $first: "$courseIntro" },
          teacherId: { $first: "$teacherId" },
          teacherFirstName: { $first: "$teacher.firstName" },
          teacherLastName: { $first: "$teacher.lastName" },
          teacherPersonalImage: { $first: "$teacher.personalImage" },
          lessonsCount: { $sum: "$allLessonsCount" },
          watchedLessons: { $sum: 0 },
          timeNow: { $first: Date.now() },
        },
      },
      { $sort: { date: -1 } },
    ])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec((err, data) => {
      if (err) res.status(400).send(err);
      else {
        if (req.body.lessons && req.body.lessons.length > 0) {
          for (const lesson of req.body.lessons) {
            for (const d of data) {
              if (lesson.seen && d._id.equals(lesson.courseId)) {
                d.watchedLessons++;
              }
            }
          }
        }
        res.status(200).send(data);
      }
    });
};
filterCourse = (req, res) => {
  if (req.body.subjectId) {
    req.body.subjectId = ObjectId(req.body.subjectId);
  }
  if (req.body.gradeId) {
    req.body.gradeId = ObjectId(req.body.gradeId);
  }
  if (req.body.educationSystemId) {
    req.body.educationSystemId = ObjectId(req.body.educationSystemId);
  }
  callCourseAggregateFunc(req, res, req.body, "default");
};
addUserIntoCourse = async (courseId, userId) => {
  return new Promise((resolve, reject) => {
    courseModel.defaultSchema.updateOne(
      {
        _id: ObjectId(courseId),
      },
      {
        $addToSet: {
          users: userId,
        },
      },
      {
        // While Update: show last updated document with new values
        new: true,
        // While Update: the default values will inserted without passing values explicitly
        setDefaultsOnInsert: true,
      },
      function (err, data) {
        if (err) reject(data);
        else resolve(data);
      }
    );
  });
};
module.exports = {
  deleteCourse: courseModel.genericSchema.delete,
  updateCourse: courseModel.genericSchema.update,
  findById: findCourseById,
  create: createWithAttachment,
  findAll,
  findTeacherCoursesByTeacherId,
  getNewReleasesCourses,
  getUserCourses,
  getExclusiveCourses,
  filterCourse,
  findUserCourseById,
  addUserIntoCourse,
};
