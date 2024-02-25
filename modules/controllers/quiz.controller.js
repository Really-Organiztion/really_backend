const quizService = require("../services/quiz.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    quizService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
  
        quizService.create(req, res);
    
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    quizService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateQuiz = (req, res) => {
  try {
    const id = req.params.id;
    quizService.updateQuiz(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteQuiz = (req, res) => {
  try {
    const id = req.params.id;
    quizService.deleteQuiz(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
getDeliveredQuizByQuizId = (req, res) => {
  try {
    const id = req.params.id;
    quizService.getDeliveredQuizByQuizId(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
checkUserQuiz = (req, res) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.params.userId;
    quizService.checkUserQuiz(req, res, quizId, userId);
  } catch (error) {
    logger.error(error);
  }
};
getUserDeliveredQuiz = (req, res) => {
  try {
    const quizId = req.params.quizId;
    const userId = req.params.userId;
    quizService.getUserDeliveredQuiz(req, res, quizId, userId);
  } catch (error) {
    logger.error(error);
  }
};
module.exports = {
  getAllData,
  create,
  findById,
  updateQuiz,
  deleteQuiz,
  getDeliveredQuizByQuizId,
  checkUserQuiz,
  getUserDeliveredQuiz,
};
