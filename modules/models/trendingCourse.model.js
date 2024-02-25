const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const trendingCourseSchema = new Schema({
  course: {
    type: ObjectId,
    required: true,
    ref: "course",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
trendingCourseSchema.index({ course: 1 }, { unique: true });
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(
    mongoose.model("trendingCourse", trendingCourseSchema)
  ),
  defaultSchema: mongoose.model("trendingCourse", trendingCourseSchema),
};
