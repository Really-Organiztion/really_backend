const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema(
  {
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
      unique: true,
    },
    verifyIdentityType: {
      type: String,
      enum: ["Active", "Request", "Refused", "Empty"],
    },
    status: {
      type: String,
      default: "Active",
      enum: ["Active", "Hold", "Bann"],
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
      enum: ["Renter", "Investor", "Owner"],
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
    idType: {
      type: String,
      enum: ["Id", "Passport"],
    },
    imageId: {
      type: String,
    },
    imageIdBack: {
      type: String,
    },
    job: {
      type: String,
    },
    emailVerify: {
      type: Boolean,
    },
    phonesList: [String],
  },

  {
    timestamps: true,
    useCreateIndex: true,
    autoIndex: true,
  }
);
const genericOperations = require("../genericService");

module.exports = {
  genericSchema: genericOperations(mongoose.model("user", userSchema)),
  defaultSchema: mongoose.model("user", userSchema),
};
