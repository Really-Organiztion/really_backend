const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const previewSchema = new Schema({
  course: {
    type: ObjectId,
    required: true,
    ref: "course",
  },
  videoUrl: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("preview", previewSchema)),
  defaultSchema: mongoose.model("preview", previewSchema),
};
