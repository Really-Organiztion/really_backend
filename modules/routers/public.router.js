const express = require("express");
const publicRouter = express.Router();
const postController = require("../controllers/post.controller");
const image3dController = require("../controllers/image3d.controller");
const likeReelController = require("../controllers/likeReel.controller");
const reelController = require("../controllers/reel.controller");
const commentController = require("../controllers/comment.controller");
const roles = require("../../helpers/roles");

publicRouter.post("/post/", postController.getAllData);
publicRouter.post("/post/map", postController.getAllDataMap);
publicRouter.post("/post/filterPost", postController.getAllDataFilterPost);
publicRouter.get("/post/:id", postController.findById);
publicRouter.post("/image3d/all", image3dController.getAllData);
publicRouter.get("/image3d/:id", image3dController.findById);
publicRouter.post("/likeReel/all", likeReelController.getAllData);
publicRouter.get("/likeReel/:id", likeReelController.findById);
publicRouter.post("/reel/all", reelController.getAllData);
publicRouter.get("/reel/:id", reelController.findById);
publicRouter.post("/comment/all", commentController.getAllData);

module.exports = publicRouter;
