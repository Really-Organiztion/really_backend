const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const requestSchema = new Schema(
  {
    details: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Identify"],
      required: true,
    },
    code: {
      type: String,
    },
    respond: {
      type: String,
    },
    status: {
      type: String,
      enum: ["UnderReview", "Accepted", "Refused"],
      default: "UnderReview",
      required: true,
    },
    target: {
      type: String,
      enum: ["User", "Unit"],
      required: true,
    },
    userId: {
      type: ObjectId,
      required: true,
      ref: "user",
    },
    adminId: {
      type: ObjectId,
      ref: "admin",
    },
    isDeleted : {
      type : Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    useCreateIndex: true,
    autoIndex: true,
  }
);
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("request", requestSchema)),
  defaultSchema: mongoose.model("request", requestSchema),
};
