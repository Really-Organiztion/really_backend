const rateService = require("../services/rate.service");
const unitService = require("../services/unit.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    rateService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

getAllDataWithComments = (req, res) => {
  try {
    rateService.findAllWithComments(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = async (req, res) => {
  try {
    let rate = await rateService.createRate(req, res);
    if (rate) {
      let str = "rate.numOfValue" + req.body.value;

      let obj = { $inc: { [str]: 1, "rate.numOfRates": 1 } };

      let unit = await unitService.updateUnitCb(obj, { _id: req.body.unitId });
      if (unit) {
        res.status(200).send(rate);
      } else {
        res.status(400).send("Can`t update unit rate");
      }
    } else {
      res.status(400).send("Can`t add rate");
    }
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    rateService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateRate = async (req, res) => {
  try {
    const id = req.params.id;
    if(!req.body || !req.body.value) {
      return res.status(400).send("Must Send Value Rate");

    }
    let findRate = await rateService.findByIdCb(req, res, id);
    if (findRate && req.body.value == findRate.value) {
      return res.status(200).send(findRate);
    }
    let rate = await rateService.updateRate(req, res, id);
    if (rate) {
      let str1 = "rate.numOfValue" + rate.value;
      let str2 = "rate.numOfValue" + findRate.value;
      let obj = { $inc: { [str1]: 1, [str2]: -1 } };
      console.log(obj);
      
      let unit = await unitService.updateUnitCb(obj, { _id: rate.unitId });
      
      if (unit) {
        res.status(200).send(rate);
      } else {
        res.status(400).send("Can`t update unit rate");
      }
    } else {
      res.status(400).send("Can`t update rate");
    }
  } catch (error) {
    console.log(error);
    
    logger.error(error);
  }
};
deleteRate = async (req, res) => {
  try {
    const id = req.params.id;
    const unitId = req.params.unitId;

    let rate = await rateService.deleteRate(req, res, id);
    if (rate) {
      let str = "rate.numOfValue" + rate.value;
      let obj = { $inc: { [str]: -1, "rate.numOfRates": -1 } };

      let unit = await unitService.updateUnitCb(obj, { _id: unitId });
      if (unit) {
        res.status(200).send(rate);
      } else {
        res.status(400).send("Can`t update unit rate");
      }
    } else {
      res.status(400).send("Can`t delete rate");
    }
  } catch (error) {
    logger.error(error);
  }
};

module.exports = {
  getAllData,
  getAllDataWithComments,
  create,
  findById,
  updateRate,
  deleteRate,
};
