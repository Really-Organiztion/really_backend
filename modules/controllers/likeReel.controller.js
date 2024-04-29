const likeReelService = require("../services/likeReel.service");
const reelService = require("../services/reel.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    likeReelService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = async (req, res) => {
  try {
    let likeReel = await likeReelService.createLikeReel(req, res);
    if (likeReel) {

      let obj = { $inc: { likes: 1 } };

      let reel = await reelService.updateReelCb(obj, req.body.reelId);
      if (reel) {
        res.status(200).send(likeReel);
      } else {
        res.status(400).send("Can`t update Reel like");
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
    likeReelService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateLikeReel = async (req, res) => {
  try {
    const id = req.params.id;
    const reelId = req.params.reelId;

    let likeReel = await likeReelService.updateLikeReel(req, res, id);
    if (likeReel) {
      let str1 = "likeReel.numOfValue" + req.body.value;
      let str2 = "likeReel.numOfValue" + likeReel.value;
      let obj = { $inc: { [str1]: 1, [str2]: -1 } };

      let reel = await reelService.updateReelCb(obj, reelId);
      if (reel) {
        res.status(200).send(likeReel);
      } else {
        res.status(400).send("Can`t update Reel like");
      }
    } else {
      res.status(400).send("Can`t update like");
    }
  } catch (error) {
    logger.error(error);
  }
};
deleteLikeReel = async (req, res) => {
  try {
    const id = req.params.id;
    const reelId = req.params.reelId;

    let likeReel = await likeReelService.deleteLikeReel(req, res, id);
    if (likeReel) {
      let obj = { $inc: { likes: -1 } };

      let reel = await reelService.updateReelCb(obj, reelId);
      if (reel) {
        res.status(200).send(likeReel);
      } else {
        res.status(400).send("Can`t update Reel like");
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
  updateLikeReel,
  deleteLikeReel,
};
