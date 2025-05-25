const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const notificationSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  userId: {
    type: ObjectId,
    required: true,
    ref: "user",
  },
  message: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    enum: ["Send", "Save", "SaveAndSend"],
    required: true,
  },
  type: {
    type: String,
    enum: [
      "Private",
      "Renter",
      "Investor",
      "Owner",
      "Public",
      "Custom",
    ],
    required: true,
  },
  screen: {
    type: String,
  },
  topic: {
    type: String,
  },
  data: {},
  image: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  seen: {
    type: Boolean,
    default: false,
  },
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(
    mongoose.model("notification", notificationSchema)
  ),
  defaultSchema: mongoose.model("notification", notificationSchema),
};
