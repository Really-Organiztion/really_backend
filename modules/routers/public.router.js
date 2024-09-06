const express = require("express");
const publicRouter = express.Router();
const postController = require("../controllers/post.controller");
const termsController = require("../controllers/terms.controller");
const image3dController = require("../controllers/image3d.controller");
const likeReelController = require("../controllers/likeReel.controller");
const favoritePostController = require("../controllers/favoritePost.controller");
const reelController = require("../controllers/reel.controller");
const commentController = require("../controllers/comment.controller");
const unitController = require("../controllers/unit.controller");
const rateController = require("../controllers/rate.controller");
const roles = require("../../helpers/roles");

publicRouter.post("/post/", postController.getAllData);
publicRouter.post("/post/map", postController.getAllDataMap);
publicRouter.post("/post/filterPost", postController.getAllDataFilterPost);
publicRouter.get("/post/:id", postController.findById);
publicRouter.post("/image3d/all", image3dController.getAllData);
publicRouter.get("/image3d/:id", image3dController.findById);
publicRouter.post("/likeReel/all", likeReelController.getAllData);
publicRouter.get("/likeReel/:id", likeReelController.findById);
publicRouter.post("/terms/all", termsController.getAllData);
publicRouter.get("/terms/:id", termsController.findById);
publicRouter.post("/favoritePost/all", favoritePostController.getAllData);
publicRouter.get("/favoritePost/:id", favoritePostController.findById);
publicRouter.post("/reel/all", reelController.getAllData);
publicRouter.get("/reel/:id", reelController.findById);
publicRouter.post("/comment/all", commentController.getAllData);
publicRouter.get("/unit/:id", unitController.findById);
publicRouter.post("/unit/nearUnitsToPosts", unitController.findNearUnitsToPosts);
publicRouter.post("/unit/nearUnits", unitController.findNearUnits);

publicRouter.post("/rate/allWithComments", rateController.getAllDataWithComments);

module.exports = publicRouter;