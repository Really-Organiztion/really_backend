const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 30,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 50,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
    },
    socialMediaToken: {
      type: String,
    },
    countryId: {
      type: ObjectId,
      required: true,
      ref: "country",
    },
    nativeCountryId: {
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
      // index: {
      //   unique: true,
      //   partialFilterExpression: {
      //     nationalID: { $type: "string" },
      //     nativeCountryId: { $type: "string" },
      //   },
      // },
      set: (v) => (v === "" ? null : v),
      length: [14, "National ID must be at least 14 characters"],
    },
    role: {
      type: String,
      required: true,
      enum: ["Renter", "Investor", "Owner"],
    },
    conPoints: {
      type: Number,
      default: 0,
    },
    profileImage: {
      url: {
        type: String,
      },
    },
    idType: {
      type: String,
      enum: ["Id", "Passport"],
    },
    imageId: {
      url: {
        type: String,
      },
    },
    imageIdBack: {
      url: {
        type: String,
      },
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    useCreateIndex: true,
    autoIndex: true,
  }
);
 userSchema.index({ nationalID: 1, nativeCountryId: 1 }, { unique: true,sparse:true });
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
