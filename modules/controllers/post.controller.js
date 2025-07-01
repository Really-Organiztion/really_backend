const postService = require("../services/post.service");
const unitService = require("../services/unit.service");
const logger = require("../../helpers/logging");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
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
      res.status(200).send([]);
    }
  } catch (error) {
    logger.error(error);
  }
};

create = async (req, res) => {
  try {
    let unit = await unitService.getUnitCb({_id : req.body.unitId, isDeleted : false});
    
    if (unit.error) {
      return res.status(400).send(unit.error); 
    }

    if (!unit.doc) {
      return res.status(404).send("Unit not found"); 
    }

    if (unit.doc.status !== "Accepted") {
      return res.status(400).send("Unit not accepted");
    }

    let post = await postService.create(req, res);
    if (post) {
      await unitService.updateUnitCb(
        { status: "Published" },
        { _id: post.unitId, status: "Accepted" }
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
    console.log(post);
    
    if (post) {
      await unitService.updateUnitCb(
        { status: "Accepted" },
        { _id: post.unitId, status: "Published" }
      );
      res.status(200).send("The post has been deleted");
    } else {
      res.status(400).send("Can`t delete post or not found");
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
