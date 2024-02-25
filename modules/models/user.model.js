const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
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
  username: {
    type: String,
    uniqe: [true, "username existing , Not available"],
    minlength: 5,
    maxlength: 20,
    required: [true, "UserName Required ! "],
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
  phone: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "normal",
    enum: ["active", "normal", "bann"],
  },
  nationalID: {
    type: String,
    trim: true,
    unique: [true, "National ID is injored"],
    length: [14, "National ID must be at least 14 characters"],
  },
  role: {
    type: String,
    required: true,
    enum: ["Investor", "Renter", "Owner"],
  },
  balance: {
    type: Number,
  },
  bonus: {
    type: Number,
  },
  currency: {
    type: String,
  },
  image: {
    type: String,
  },
  job: {
    type: String,
  },
  phonesList: [String],
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("user", userSchema)),
  defaultSchema: mongoose.model("user", userSchema),
};