const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const termsSchema = new Schema(
  {
    nameLangList: [{ language: { type: String }, name: { type: String } }],
    type: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
    },
    version: {
      type: Number,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    useCreateIndex: true,
    autoIndex: true,
  }
);
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("terms", termsSchema)),
  defaultSchema: mongoose.model("terms", termsSchema),
};
