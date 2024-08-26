const postService = require("../services/post.service");
const unitService = require("../services/unit.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    postService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

getAllDataMap = (req, res) => {
  try {
    postService.findAllMap(req, res);
  } catch (error) {
    logger.error(error);
  }
};

getAllDataFilterPost = async (req, res) => {
  try {
    const unitsIds = await unitService.findAllFilterCb(req, res);
    if (unitsIds) {
      if (req.body) {
        req.body.unitsIds = unitsIds;
      } else {
        req.body = { unitsIds: unitsIds };
      }
      postService.findAll(req, res);
    } else {
      res.status(400).send("Posts not found");
    }
  } catch (error) {
    logger.error(error);
  }
};

create = async (req, res) => {
  try {
    let post = await postService.create(req, res);
    if (post) {
      await unitService.updateUnitCb(
        { status: "Published" },
        { _id: post.unitId,status : "Accepted" }
      );
      res.status(200).send(post);
    } else {
      res.status(400).send("Can`t add post");
    }
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
deletePost = async (req, res) => {
  try {
    const id = req.params.id;
    let post = await postService.deletePost(req, res, id);
    
    if (post) {
      await unitService.updateUnitCb(
        { status: "Accepted" },
        { _id: post.unitId, status: "Published" }
      );
      res.status(200).send("The post has been deleted");
    }
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllDataFilterPost,
  create,
  findById,
  updatePost,
  deletePost,
  getAllData,
  getAllDataMap,
};
