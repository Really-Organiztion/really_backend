const favoritePostService = require("../services/favoritePost.service");
const postService = require("../services/post.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    favoritePostService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = async (req, res) => {
  try {
    let favoritePost = await favoritePostService.createFavoritePost(req, res);
    if (favoritePost) {

      let obj = { $inc: { favorites: 1 } };

      let post = await postService.updatePostCb(obj, req.body.postId);
      if (post) {
        res.status(200).send(favoritePost);
      } else {
        res.status(400).send("Can`t update Post like");
      }
    } else {
      res.status(400).send("Can`t add like");
    }
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    favoritePostService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateFavoritePost = async (req, res) => {
  try {
    const id = req.params.id;
    const postId = req.params.postId;

    let favoritePost = await favoritePostService.updateFavoritePost(req, res, id);
    if (favoritePost) {
      let str1 = "favoritePost.numOfValue" + req.body.value;
      let str2 = "favoritePost.numOfValue" + favoritePost.value;
      let obj = { $inc: { [str1]: 1, [str2]: -1 } };

      let post = await postService.updatePostCb(obj, postId);
      if (post) {
        res.status(200).send(favoritePost);
      } else {
        res.status(400).send("Can`t update Post like");
      }
    } else {
      res.status(400).send("Can`t update like");
    }
  } catch (error) {
    logger.error(error);
  }
};
deleteFavoritePost = async (req, res) => {
  try {
    const id = req.params.id;
    const postId = req.params.postId;

    let favoritePost = await favoritePostService.deleteFavoritePost(req, res, id);
    if (favoritePost) {
      let obj = { $inc: { favorites: -1 } };

      let post = await postService.updatePostCb(obj, postId);
      if (post) {
        res.status(200).send(favoritePost);
      } else {
        res.status(400).send("Can`t update Post like");
      }
    } else {
      res.status(400).send("Can`t delete like");
    }
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  create,
  findById,
  updateFavoritePost,
  deleteFavoritePost,
};
