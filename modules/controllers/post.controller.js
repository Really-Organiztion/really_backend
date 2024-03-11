const postService = require("../services/post.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    postService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
    postService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    postService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updatePost = (req, res) => {
  try {
    const id = req.params.id;
    postService.updatePost(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deletePost = (req, res) => {
  try {
    const id = req.params.id;
    postService.deletePost(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  create,
  findById,
  updatePost,
  deletePost,
};
