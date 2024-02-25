const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const courseSchema = new Schema({
  subjectId: {
    type: ObjectId,
    ref: "subject",
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
  price: {
    type: Number,
    required: true,
  },
  courseIcon: {
    type: String,
    required: true,
  },
  teacherId: {
    type: ObjectId,
    ref: "teacher",
  },
  courseIntro: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  users: [ObjectId],
  date: {
    type: Date,
    default: Date.now,
  },
  exclusive: {
    type: Boolean,
    default: false,
  },
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("course", courseSchema)),
  defaultSchema: mongoose.model("course", courseSchema),
};
