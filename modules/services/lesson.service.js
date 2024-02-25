const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const lessonModel = require("../models/lesson.model");
const handleFiles = require("../../helpers/handleFiles");
const attachmentPath = require("../../helpers/attachmentPath.json");
const itemPath = attachmentPath.attachments.lessonItemsPath;
const taskPath = attachmentPath.attachments.lessonTasksPath;
const quizPath = attachmentPath.attachments.lessonQuizzesPath;

findAll = (req, res) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  const lang = req.query.lang ? req.query.lang : "en";
  const toFound = lang === "en" ? "name" : "nameAr";
  lessonModel.defaultSchema
    .aggregate([
      {
        $group: {
          _id: "$_id",
          chapterId: { $first: "$chapterId" },
          name: { $first: `$${toFound}` },
          price: { $first: "$price" },
          validFor: { $first: "$validFor" },
          liveSession: { $first: "$liveSession" },
          startDate: { $first: "$startDate" },
          startTime: { $first: "$startTime" },
          meetingId: { $first: "$meetingId" },
          meetingPassword: { $first: "$meetingPassword" },
          items: { $first: "$items" },
          tasks: { $first: "$tasks" },
          quizzes: { $first: "$quizzes" },
        },
      },
    ])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec((err, data) => res.json(err || data));
};

create = (req, res) => {
  lessonModel.defaultSchema.create(req.body, function (err, result) {
    if (err) res.status(500).send(err);
    else res.status(201).send(result);
  });
};
addContentIntoLesson = async (req, res, id) => {
  if (req.body.type === "Attachment") {
    try {
      req.body.value = await handleFiles.saveFiles(
        req.body.value,
        req.body.type,
        itemPath
      );
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  lessonModel.defaultSchema.findByIdAndUpdate(
    id,
    { $push: { items: req.body } },
    {
      // While Update: show last updated document with new values
      new: true,
      // While Update: the default values will inserted without passing values explicitly
      setDefaultsOnInsert: true,
    },
    function (err, data) {
      if (err) res.status(500).send(err);
      else if (data === null) res.status(404).send("ID is not found");
      else res.status(200).send(data);
    }
  );
};
addTaskIntoLesson = async (req, res, id) => {
  if (req.body.requirements) {
    for (const element of req.body.requirements) {
      if (element.type === "Attachment" || element.type === "Voice") {
        try {
          element.value = await handleFiles.saveFiles(
            element.value,
            element.type,
            taskPath
          );
        } catch (error) {
          return res.status(500).send(error);
        }
      }
    }
    lessonModel.defaultSchema.findByIdAndUpdate(
      id,
      { $push: { tasks: req.body } },
      {
        // While Update: show last updated document with new values
        new: true,
        // While Update: the default values will inserted without passing values explicitly
        setDefaultsOnInsert: true,
      },
      function (err, data) {
        if (err) res.status(500).send(err);
        else if (data === null) res.status(404).send("ID is not found");
        else res.status(200).send(data);
      }
    );
  }
};
deleteLesson = async (req, res, id) => {
  allAttachments = [];
  lessonModel.defaultSchema.findByIdAndRemove(id, function (err, data) {
    if (err) res.status(500).send(err);
    else {
      if (data === null) res.sendStatus(404);
      else {
        let promise = new Promise((resolve, reject) => {
          data.items.forEach((element, index, array) => {
            if (element.type === "Attachment") {
              allAttachments.push(element.value);
            }
            if (index === array.length - 1) resolve();
          });
        });
        promise.then(async () => {
          try {
            for (const attach of allAttachments) {
              await handleFiles.deleteFile(attach, itemPath);
            }
            res.sendStatus(200);
          } catch (error) {
            res.send(error);
          }
        });
      }
    }
  });
};
updateContent = async (req, res, lessonId, contentId) => {
  if (req.body.toDelete) {
    handleFiles.deleteFile(req.body.toDelete, itemPath);
  }
  if (req.body.item.type === "Attachment") {
    try {
      req.body.item.value = await handleFiles.saveFiles(
        req.body.item.value,
        req.body.item.type,
        itemPath
      );
    } catch (error) {
      return res.status(500).send(error);
    }
  }
  lessonModel.defaultSchema
    .findOneAndUpdate(
      {
        _id: lessonId,
        "items._id": contentId,
      },
      { $set: { items: req.body.item } },
      {
        // While Update: show last updated document with new values
        new: true,
        // While Update: the default values will inserted without passing values explicitly
        setDefaultsOnInsert: true,
      }
    )
    .exec((err, data) => res.send(err || data));
};
updateTask = async (req, res, lessonId, taskId) => {
  if (req.body.toDelete && req.body.toDelete.length > 0) {
    for (const toDelete of req.body.toDelete) {
      await handleFiles.deleteFile(toDelete, taskPath);
    }
  }
  if (req.body.task.requirements) {
    for (const element of req.body.task.requirements) {
      if (element.type === "Attachment" || element.type === "Voice") {
        try {
          element.value = await handleFiles.saveFiles(
            element.value,
            element.type,
            taskPath
          );
        } catch (error) {
          return res.status(500).send(error);
        }
      }
    }
  }
  lessonModel.defaultSchema
    .findOneAndUpdate(
      {
        _id: lessonId,
        "tasks._id": taskId,
      },
      { $set: { tasks: req.body.task } },
      {
        // While Update: show last updated document with new values
        new: true,
        // While Update: the default values will inserted without passing values explicitly
        setDefaultsOnInsert: true,
      }
    )
    .exec((err, data) => res.send(err || data));
};
deleteContent = async (req, res, lessonId, contentId) => {
  lessonModel.defaultSchema.findOneAndUpdate(
    {
      _id: lessonId,
    },
    { $pull: { items: { _id: contentId }, tasks: { _id: contentId } } },
    { safe: true, multi: true },
    function (err, data) {
      if (err) res.status(500).send(err);
      else {
        if (data === null) res.sendStatus(404);
        else {
          if (req.body.toDelete) {
            handleFiles.deleteFile(req.body.toDelete, itemPath);
          }
          res.sendStatus(200);
        }
      }
    }
  );
};
addQuizIntoLesson = async (req, res, id) => {
  for (const element of req.body.questions) {
    if (element.question.image && element.question.image.startsWith("data:")) {
      try {
        element.question.image = await handleFiles.saveFiles(
          element.question.image,
          "Question",
          quizPath
        );
      } catch (error) {
        return res.status(500).send(error);
      }
    }
    for (const answer of element.answers) {
      if (answer.image && answer.image.startsWith("data:")) {
        try {
          answer.image = await handleFiles.saveFiles(
            answer.image,
            "Answer",
            quizPath
          );
        } catch (error) {
          return res.status(500).send(error);
        }
      }
    }
    if (
      element.justification.image &&
      element.justification.image.startsWith("data:")
    ) {
      try {
        element.justification.image = await handleFiles.saveFiles(
          element.justification.image,
          "Justification",
          quizPath
        );
      } catch (error) {
        return res.status(500).send(error);
      }
    }
  }
  lessonModel.defaultSchema.findByIdAndUpdate(
    id,
    { $push: { quizzes: req.body } },
    {
      // While Update: show last updated document with new values
      new: true,
      // While Update: the default values will inserted without passing values explicitly
      setDefaultsOnInsert: true,
    },
    function (err, data) {
      if (err) res.status(500).send(err);
      else if (data === null) res.status(404).send("ID is not found");
      else res.status(200).send(data);
    }
  );
};
updateQuiz = async (req, res, lessonId, quizId) => {
  if (req.body.toDelete && req.body.toDelete.length > 0) {
    for (const toDelete of req.body.toDelete) {
      await handleFiles.deleteFile(toDelete, quizPath);
    }
  }
  if (req.body.quiz.questions) {
    for (const element of req.body.quiz.questions) {
      if (
        element.question.image &&
        element.question.image.startsWith("data:")
      ) {
        try {
          element.question.image = await handleFiles.saveFiles(
            element.question.image,
            "Question",
            quizPath
          );
        } catch (error) {
          return res.status(500).send(error);
        }
      }
      for (const answer of element.answers) {
        if (answer.image && answer.image.startsWith("data:")) {
          try {
            answer.image = await handleFiles.saveFiles(
              answer.image,
              "Answer",
              quizPath
            );
          } catch (error) {
            return res.status(500).send(error);
          }
        }
      }
      if (
        element.justification.image &&
        element.justification.image.startsWith("data:")
      ) {
        try {
          element.justification.image = await handleFiles.saveFiles(
            element.justification.image,
            "Justification",
            quizPath
          );
        } catch (error) {
          return res.status(500).send(error);
        }
      }
    }
  }
  lessonModel.defaultSchema
    .findOneAndUpdate(
      {
        _id: lessonId,
        "quizzes._id": quizId,
      },
      { $set: { quizzes: req.body.quiz } },
      {
        // While Update: show last updated document with new values
        new: true,
        // While Update: the default values will inserted without passing values explicitly
        setDefaultsOnInsert: true,
      }
    )
    .exec((err, data) => res.send(err || data));
};
deleteQuiz = async (req, res, lessonId, quizId) => {
  lessonModel.defaultSchema.findOneAndUpdate(
    {
      _id: lessonId,
    },
    { $pull: { quizzes: { _id: quizId } } },
    { safe: true, multi: true },
    function (err, data) {
      if (err) res.status(500).send(err);
      else {
        if (data === null) res.sendStatus(404);
        else {
          if (req.body.toDelete && req.body.toDelete.length > 0) {
            for (const toDelete of req.body.toDelete) {
              handleFiles.deleteFile(toDelete, quizPath);
            }
          }
          res.sendStatus(200);
        }
      }
    }
  );
};
module.exports = {
  deleteLesson: lessonModel.genericSchema.delete,
  updateLesson: lessonModel.genericSchema.update,
  findById: lessonModel.genericSchema.findById,
  create,
  findAll,
  addContentIntoLesson,
  addTaskIntoLesson,
  updateContent,
  deleteContent,
  updateTask,
  addQuizIntoLesson,
  updateQuiz,
  deleteQuiz,
};
