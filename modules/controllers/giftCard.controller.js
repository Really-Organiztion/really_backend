const giftCardService = require("../services/giftCard.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    giftCardService.findAll(req, res, "default");
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
  
        giftCardService.create(req, res);
    
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    giftCardService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateGiftCard = (req, res) => {
  try {
    const id = req.params.id;
    giftCardService.updateGiftCard(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteGiftCard = (req, res) => {
  try {
    const id = req.params.id;
    giftCardService.deleteGiftCard(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
findAllGiftsWithOutExec = (req, res) => {
  try {
    return giftCardService.findAll(req, res, "other");
  } catch (error) {
    logger.error(error);
  }
};
module.exports = {
  getAllData,
  create,
  findById,
  updateGiftCard,
  deleteGiftCard,
  findAllGiftsWithOutExec,
};
