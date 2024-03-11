const commentService = require("../services/comment.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    commentService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
    commentService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    commentService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateComment = (req, res) => {
  try {
    const id = req.params.id;
    commentService.updateComment(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteComment = (req, res) => {
  try {
    const id = req.params.id;
    commentService.deleteComment(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  create,
  findById,
  updateComment,
  deleteComment,
};
