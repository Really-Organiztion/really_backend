const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const lessonSchema = new Schema({
  chapterId: {
    type: ObjectId,
    required: true,
    ref: "chapter",
  },
  name: {
    type: String,
    required: true,
  },
  nameAr: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  validFor: {
    type: Number,
  },
  liveSession: {
    type: Boolean,
    default: false,
  },
  startDate: {
    type: Date,
  },
  startTime: {
    type: String,
  },
  meetingId: {
    type: String,
  },
  meetingPassword: {
    type: String,
  },
  items: [
    {
      name: {
        type: String,
      },
      nameAr: {
        type: String,
      },
      type: {
        type: String,
        enum: ["Video", "Attachment"],
      },
      value: {
        type: String,
      },
      videoLength: {
        type: Number,
      },
    },
  ],
  tasks: [
    {
      name: {
        type: String,
      },
      nameAr: {
        type: String,
      },
      deadline: {
        type: Date,
      },
      requirements: [
        {
          type: {
            type: String,
            enum: ["Attachment", "Text", "Link", "Voice"],
          },
          value: {
            type: String,
          },
        },
      ],
    },
  ],
  quizzes: [
    {
      name: {
        type: String,
      },
      nameAr: {
        type: String,
      },
      durationTimeQuiz: {
        type: Boolean,
      },
      duration: {
        type: Number,
      },
      displayCorrectAnswer: {
        type: Boolean,
      },
      showAnswersPerQuestion: {
        type: Boolean,
      },
      questions: [
        {
          question: {
            text: {
              type: String,
            },
            image: {
              type: String,
            },
          },
          answers: [
            {
              text: {
                type: String,
              },
              image: {
                type: String,
              },
              correct: {
                type: Boolean,
                default: false,
              },
            },
          ],
          justification: {
            text: {
              type: String,
            },
            image: {
              type: String,
            },
            link: {
              type: String,
            },
          },
        },
      ],
    },
  ],
});
lessonSchema.index({ name: 1, chapterId: 1 }, { unique: true });
const genericOperations = require("../genericService");
module.exports = {
  genericSchema: genericOperations(mongoose.model("lesson", lessonSchema)),
  defaultSchema: mongoose.model("lesson", lessonSchema),
};
