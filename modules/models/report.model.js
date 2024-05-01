const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const reportSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    required: true,
    ref: "user",
  },
  targetType: {
    type: String,
    required: true,
    enum : ["User","Unit","Comment" , "Post"]
  },
  targetId: {
    type: ObjectId,
    required: true,
  },
});
const genericOperations = require("../genericService");
const { stringify } = require("uuid");
module.exports = {
  genericSchema: genericOperations(mongoose.model("report", reportSchema)),
  defaultSchema: mongoose.model("report", reportSchema),
};
