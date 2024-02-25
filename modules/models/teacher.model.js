const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const teacherSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
  },
  socialMediaToken: {
    type: String,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  specialization: {
    type: String,
    required: true,
  },
  nationality: {
    type: String,
    required: true,
  },
  frontIdCard: {
    type: String,
    required: true,
  },
  backIdCard: {
    type: String,
    required: true,
  },
  certificates: [String],
  personalImage: {
    type: String,
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  bio: String,
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("teacher", teacherSchema)),
  defaultSchema: mongoose.model("teacher", teacherSchema),
};
