const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    otp: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: '5m' // Set expiration time for OTPs (e.g., 5 minutes)
    }
  }
);
const genericOperations = require("../genericService");

module.exports = {
  genericSchema: genericOperations(mongoose.model("userOpt", userSchema)),
  defaultSchema: mongoose.model("userOpt", userSchema),
};
