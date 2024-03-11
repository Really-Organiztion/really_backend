const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const postSchema = new Schema({
  description: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
    enum : ['Investment', 'Rent']
  },
  userId: {
    type: ObjectId,
    required: true,
    ref: "user",
  },
  unitId: {
    type: ObjectId,
    required: true,
    ref: "unit",
  },
  isDeleted : {
    type : Boolean,
    default : false
  }
});
postSchema.index({ target: 1, unitId: 1, userId: 1 }, { unique: true });

const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("post", postSchema)),
  defaultSchema: mongoose.model("post", postSchema),
};
