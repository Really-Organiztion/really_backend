const communityService = require("../services/community.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    communityService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
  
        communityService.create(req, res);
   
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    communityService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateCommunity = (req, res) => {
  try {
    const id = req.params.id;
    communityService.updateCommunity(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteCommunity = (req, res) => {
  try {
    const id = req.params.id;
    communityService.deleteCommunity(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
addAnswerIntoCommunity = (req, res) => {
  try {
   
        const id = req.params.id;
        communityService.addAnswerIntoCommunity(req, res, id);
   
  } catch (error) {
    logger.error(error);
  }
};
addMultipleAnswersIntoCommunity = (req, res) => {
  try {
   
          const id = req.params.id;
          communityService.addMultipleAnswersIntoCommunity(req, res, id);
      
  } catch (error) {
    logger.error(error);
  }
};
findAllCommunitiesWithCourseId = (req, res) => {
  try {
    const id = req.params.id;
    communityService.findAllCommunitiesWithCourseId(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateCommunityAnswer = (req, res) => {
  try {
  
          const id = req.params.id;
          communityService.updateCommunityAnswer(req, res, id);
      
  } catch (error) {
    logger.error(error);
  }
};
search = (req, res) => {
  try {
  
        communityService.search(req, res);
    
  } catch (error) {
    logger.error(error);
  }
};
module.exports = {
  getAllData,
  create,
  findById,
  updateCommunity,
  deleteCommunity,
  addAnswerIntoCommunity,
  addMultipleAnswersIntoCommunity,
  findAllCommunitiesWithCourseId,
  updateCommunityAnswer,
  search,
};
