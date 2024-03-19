const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const communityModel = require("../models/community.model");
const handleFiles = require("../../helpers/handleFiles");
const attachmentPath = require("../../helpers/attachmentPath.json");
const path = attachmentPath.attachments.communityAttachmentPath;

findAll = (req, res) => {
  let obj = {};
  callCommunityAggregateFunction(req, res, obj);
};
findAllCommunitiesWithCourseId = (req, res, courseId) => {
  let obj = {
    courseId: ObjectId(courseId),
  };
  if (req.query.filter === "solved") {
    obj = { ...obj, "answers.0": { $exists: true } };
  } else if (req.query.filter === "unsolved") {
    obj = { ...obj, "answers.0": { $exists: false } };
  }
  callCommunityAggregateFunction(req, res, obj);
};
callCommunityAggregateFunction = (req, res, obj) => {
  const pageNumber = req.query.pageNumber ? req.query.pageNumber : 1;
  const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
  communityModel.defaultSchema
    .aggregate([
      {
        $match: obj,
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          courseId: { $first: "$courseId" },
          question: { $first: "$question" },
          attachments: { $first: "$attachments" },
          userId: { $first: "$userId" },
          userFirstName: { $first: "$user.firstName" },
          userLastName: { $first: "$user.lastName" },
          answers: { $first: "$answers" },
        },
      },
    ])
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .exec((err, data) => res.json(err || data));
};
addAnswerIntoCommunity = async (req, res, id) => {
  if (req.body.type === "Attachment") {
    try {
      req.body.value = await handleFiles.saveFiles(
        req.body.value,
        req.body.type,
        path
      );
    } catch (error) {
      return res.status(400).send(error);
    }
  }
  communityModel.defaultSchema.findByIdAndUpdate(
    id,
    { $push: { answers: req.body } },
    {
      // While Update: show last updated document with new values
      new: true,
      // While Update: the default values will inserted without passing values explicitly
      setDefaultsOnInsert: true,
    },
    function (err, data) {
      if (err) res.status(400).send(err);
      else if (data === null) res.status(404).send("ID is not found");
      else res.status(200).send(data);
    }
  );
};
addMultipleAnswersIntoCommunity = async (req, res, id) => {
  let promise = new Promise(async (resolve, reject) => {
    if (req.body.answers && req.body.answers.length > 0) {
      const allAttachments = [];
      for (const answer of req.body.answers) {
        if (answer.value.startsWith("data:")) {
          try {
            answer.value = await handleFiles.saveFiles(
              answer.value,
              answer.type,
              path
            );
            allAttachments.push(answer.value);
          } catch (error) {
            return res.status(400).send(error);
          }
        } else {
          allAttachments.push(answer.value);
        }
        if (allAttachments.length === req.body.answers.length) resolve();
      }
    } else resolve();
  });
  promise.then(() => {
    communityModel.defaultSchema.findByIdAndUpdate(
      id,
      { $set: { answers: req.body.answers } },
      {
        // While Update: show last updated document with new values
        new: true,
        // While Update: the default values will inserted without passing values explicitly
        setDefaultsOnInsert: true,
      },
      function (err, data) {
        if (err) res.status(400).send(err);
        else if (data === null) res.status(404).send("ID is not found");
        else res.status(200).send(data);
      }
    );
  });
};
updateCommunityAnswer = async (req, res, id) => {
  if (req.body.toDelete && req.body.toDelete.length > 0) {
    for (const toDelete of req.body.toDelete) {
      await handleFiles.deleteFile(toDelete, path);
    }
  }
  if (req.body.answers) {
    addMultipleAnswersIntoCommunity(req, res, id);
  }
};
search = (req, res) => {
  let obj = {
    courseId: ObjectId(req.body.courseId),
    question: { $regex: req.body.question, $options: "i" },
  };
  callCommunityAggregateFunction(req, res, obj);
};
createCommunity = async (req, res) => {
  let promise = new Promise(async (resolve, reject) => {
    if (req.body.attachments && req.body.attachments.length > 0) {
      const allAttachments = [];
      for (const attach of req.body.attachments) {
        const result = await handleFiles.saveFiles(attach, "Attachment", path);
        allAttachments.push(result);
      }
      req.body.attachments = allAttachments;
      if (allAttachments.length === req.body.attachments.length) resolve();
    } else {
      resolve();
    }
  });
  promise.then(() => {
    communityModel.defaultSchema.create(req.body, function (err, data) {
      if (err) res.status(400).send(err);
      else res.status(200).send(req.body);
    });
  });
};
deleteCommunity = async (req, res, id) => {
  if (req.body.toDelete && req.body.toDelete.length > 0) {
    for (const toDelete of req.body.toDelete) {
      await handleFiles.deleteFile(toDelete, path);
    }
  }
  communityModel.defaultSchema.findByIdAndRemove(id, function (err, data) {
    if (err) res.status(400).send(err);
    else {
      if (data === null) res.sendStatus(404);
      else res.sendStatus(200);
    }
  });
};
module.exports = {
  deleteCommunity,
  updateCommunity: communityModel.genericSchema.update,
  findById: communityModel.genericSchema.findById,
  create: createCommunity,
  findAll,
  addAnswerIntoCommunity,
  addMultipleAnswersIntoCommunity,
  findAllCommunitiesWithCourseId,
  updateCommunityAnswer,
  search,
};
