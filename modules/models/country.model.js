const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const countrySchema = new Schema({
  numericCode: {
    type: String,
    required: true,
    trim: true,
    unique: true,
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
  currencyId: {
    type: ObjectId,
    required: true,
    ref: "currency",
  },
  flag: {
    type: String,
  },
  timezones: {
    zoneName: {
      type: String,
    },
    offset: {
      type: Number,
    },
    offsetName: {
      type: String,
    },
    abbreviation: {
      type: String,
    },
    tzName: {
      type: String,
    },
  },
  latitude: {
    type: String,
  },
  longitude: {
    type: String,
  },
  isDeleted : {
    type : Boolean,
    default : false
  }
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("country", countrySchema)),
  defaultSchema: mongoose.model("country", countrySchema),
};
