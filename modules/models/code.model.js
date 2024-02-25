const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const codeSchema = new Schema({
  courseId: {
    type: ObjectId,
    required: true,
    ref: "course",
  },
  subjectId: {
    type: ObjectId,
    ref: "subject",
    required: true,
  },
  teacherId: {
    type: ObjectId,
    ref: "teacher",
    required: true,
  },
  educationSystemId: {
    type: ObjectId,
    ref: "educationSystem",
    required: true,
  },
  gradeId: {
    type: ObjectId,
    ref: "grade",
    required: true,
  },
  codeLessons: [ObjectId],
  numberOfCodes: {
    type: Number,
    required: true,
  },
  codes: [
    {
      code: String,
      isUsed: {
        type: Boolean,
        default: false,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("code", codeSchema)),
  defaultSchema: mongoose.model("code", codeSchema),
};
