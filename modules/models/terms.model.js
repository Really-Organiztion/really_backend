const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const termsSchema = new Schema({
 
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
  type: {
    type: String,
    enum: ["Register", "AddUnit", "AddPost"],
    required: true,
  },
  
  isDeleted : {
    type : Boolean,
    default : false
  }
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("terms", termsSchema)),
  defaultSchema: mongoose.model("terms", termsSchema),
};
