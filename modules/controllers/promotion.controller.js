const logger = require("../../helpers/logging");
const promoCodeController = require("./promoCode.controller");
const giftCardController = require("./giftCard.controller");
const packageController = require("./package.controller");

getAllData = async (req, res) => {
  try {
    let promoCodes = await promoCodeController.findAllPromosWithOutExec(
      req,
      res
    );
    let giftCards = await giftCardController.findAllGiftsWithOutExec(req, res);
    let packages = await packageController.findAllPackagesWithOutExec(req, res);
    let obj = {
      promoCodes,
      giftCards,
      packages,
    };
    res.send(obj);
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
};
