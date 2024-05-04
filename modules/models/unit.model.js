const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const unitSchema = new Schema(
  {
    userId: {
      type: ObjectId,
      required: true,
      ref: "user",
    },
    // name: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    // nameAr: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    targetType: {
      type: String,
      required: true,
      enum: ["None", "Investment", "Rent"],
    },
    area: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gLocationLink: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "Building",
        "Apartment",
        "Hotel",
        "Villa",
        "Land",
        "Farm",
        "Tent",
        "session",
        "Hall",
        "Room",
        "Bed",
      ],
    },
    imagesList: [
      {
        url: {
          type: String,
        },
      },
    ],
    video: {
      url: {
        type: String,
      },
    },
    additionsTypes: {
      type: Object,
    },
    additionsServices: [String],
    servicesId: [{ type: ObjectId, ref: "serviceType" }],
    countryId: {
      type: ObjectId,
      ref: "country",
    },
    rate: {
      numOfRates: {
        type: Number,
        default: 0,
      },
      numOfValue1: {
        type: Number,
        default: 0,
      },
      numOfValue2: {
        type: Number,
        default: 0,
      },
      numOfValue3: {
        type: Number,
        default: 0,
      },
      numOfValue4: {
        type: Number,
        default: 0,
      },
      numOfValue5: {
        type: Number,
        default: 0,
      },
    },
    parentsId: [ObjectId],
    location: {
      type: {
        type: String,
      },
      coordinates: [],
    },
    isTrusted: {
      type: Boolean,
      default: false,
    },
    has3DView: {
      type: Boolean,
      default: false,
    },
    isSeparated: {
      type: Boolean,
      default: false,
    },
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

const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("unit", unitSchema)),
  defaultSchema: mongoose.model("unit", unitSchema),
};
