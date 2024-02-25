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
  educationSystem: {
    type: ObjectId,
    ref: "educationSystem",
    required: true,
  },
  grade: {
    type: ObjectId,
    ref: "grade",
    required: true,
  },
  courses: [ObjectId],
  lessons: [
    {
      courseId: ObjectId,
      lessonId: ObjectId,
      type: {
        type: String,
        enum: ["Code", "Credit"],
      },
      orderId: String,
      merchantOrderId: String,
      seen: {
        type: Boolean,
        default: false,
      },
      validFor: Number,
      startDate: Date,
      endDate: Date,
    },
  ],
  favorites: [ObjectId],
  promoCodes: [String],
});
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("user", userSchema)),
  defaultSchema: mongoose.model("user", userSchema),
};
