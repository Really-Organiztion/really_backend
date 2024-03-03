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
      required: [true, "UserName Required ! "],
      minlength: 5,
      maxlength: 20,
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
    countryId: {
      type: ObjectId,
      ref: "country",
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
      default: 0,
    },
    bonus: {
      type: Number,
      default: 0,
    },
    profileImage: {
      url : {
        type: String,
      },
     
    },
    idType: {
      type: String,
      enum: ["Id", "Passport"],
    },
    imageId: {
      url : {
        type: String,
      }
    },
    imageIdBack: {
      url : {
        type: String,
      }
    },
    job: {
      type: String,
    },
    deviceToken: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female"],
    },
    birthDate: {
      type: Date,
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
// userSchema.virtual("countries", {
//   ref: "country",
//   foreignField: "countryId",
//   localField: "_id"
// });
module.exports = {
  genericSchema: genericOperations(mongoose.model("user", userSchema)),
  defaultSchema: mongoose.model("user", userSchema),
};
