const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const notificationSchema = new Schema({
  userId: {
    type: ObjectId,
    required: true,
  },
  notification: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(
    mongoose.model("notification", notificationSchema)
  ),
  defaultSchema: mongoose.model("notification", notificationSchema),
};
