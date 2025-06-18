const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const adminSettingSchema = new Schema({
  bookingBounus: {
    type: Number,
    default: 0,
  },
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("adminSetting", adminSettingSchema)),
  defaultSchema: mongoose.model("adminSetting", adminSettingSchema),
};
