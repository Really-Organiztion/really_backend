const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const packageSchema = new Schema({
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
  },
  gradeId: {
    type: ObjectId,
    ref: "grade",
  },
  packageLessons: [ObjectId],
  oldPrice: { type: Number, required: true },
  newPrice: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("package", packageSchema)),
  defaultSchema: mongoose.model("package", packageSchema),
};
