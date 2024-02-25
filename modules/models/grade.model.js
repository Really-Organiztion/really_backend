const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const gradeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  nameAr: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  educationSystems: [ObjectId],
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("grade", gradeSchema)),
  defaultSchema: mongoose.model("grade", gradeSchema),
};
