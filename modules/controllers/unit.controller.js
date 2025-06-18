const unitService = require("../services/unit.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    unitService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findCoordinatesMatch = (req, res) => {
  try {
    unitService.findCoordinatesMatch(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findNearUnits = (req, res) => {
  try {
    unitService.findNearUnits(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findNearUnitsToPosts = (req, res) => {
  try {
    unitService.findNearUnitsToPosts(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
    unitService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    unitService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateUnit = (req, res) => {
  try {
    const id = req.params.id;
    unitService.updateUnit(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteUnit = (req, res) => {
  try {
    const id = req.params.id;
    unitService.deleteUnit(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

getCoordinates = async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res
      .status(400)
      .json({ error: "Please provide a valid URL in the 'url' field." });
  }

  try {
    const coords = await unitService.getCoordinates(url);
    if (coords) {
      return res.json({ success: true, coordinates: coords });
    } else {
      return res
        .status(400)
        .json({
          success: false,
          error: "Unable to extract coordinates from the provided URL.",
        });
    }
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, error: "Coordinates not found." });
  }
};

module.exports = {
  getAllData,
  findCoordinatesMatch,
  findNearUnits,
  findNearUnitsToPosts,
  create,
  findById,
  updateUnit,
  deleteUnit,
  getCoordinates,
};
