const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const educationSystemSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  nameAr: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(
    mongoose.model("educationSystem", educationSystemSchema)
  ),
  defaultSchema: mongoose.model("educationSystem", educationSystemSchema),
};
