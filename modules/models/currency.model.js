const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const currencySchema = new Schema({
  numericCode: {
    type: String,
    required: true,
    trim: true,
  },
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
  code: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  flag: {
    type: String,
  },
  isDeleted : {
    type : Boolean,
    default : false
  }
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("currency", currencySchema)),
  defaultSchema: mongoose.model("currency", currencySchema),
};
