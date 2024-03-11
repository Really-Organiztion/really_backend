const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const serviceTypeSchema = new Schema({
 
  name: {
    type: String,
    required: true,
    unique: true,
  },
  nameAr: {
    type: String,
    required: true,
    unique: true,
  },
  isDeleted : {
    type : Boolean,
    default : false
  }
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("serviceType", serviceTypeSchema)),
  defaultSchema: mongoose.model("serviceType", serviceTypeSchema),
};
