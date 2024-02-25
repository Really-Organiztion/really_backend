const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const chapterSchema = new Schema({
  courseId: {
    type: ObjectId,
    required: true,
    ref: "course",
  },
  name: {
    type: String,
    required: true,
  },
  nameAr: {
    type: String,
    required: true,
  },
});
chapterSchema.index({ name: 1, courseId: 1 }, { unique: true });
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("chapter", chapterSchema)),
  defaultSchema: mongoose.model("chapter", chapterSchema),
};
