const express = require("express");
const communityRouter = express.Router();
const communityController = require("../controllers/community.controller");

communityRouter.get("/", communityController.getAllData);
communityRouter.post("/", communityController.create);
communityRouter.post("/search", communityController.search);
communityRouter.put(
  "/addAnswerIntoCommunity/:id",
  communityController.addAnswerIntoCommunity
);
communityRouter.put(
  "/addMultipleAnswersIntoCommunity/:id",
  communityController.addMultipleAnswersIntoCommunity
);
communityRouter.put(
  "/updateCommunityAnswer/:id",
  communityController.updateCommunityAnswer
);
communityRouter.get(
  "/findAllCommunitiesWithCourseId/:id",
  communityController.findAllCommunitiesWithCourseId
);
communityRouter.get("/:id", communityController.findById);
communityRouter.put("/:id", communityController.updateCommunity);
communityRouter.delete("/:id", communityController.deleteCommunity);

module.exports = communityRouter;
