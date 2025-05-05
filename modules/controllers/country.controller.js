const countryService = require("../services/country.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    countryService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

create = (req, res) => {
  try {
    countryService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    countryService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateCountry = (req, res) => {
  try {
    const id = req.params.id;
    countryService.updateCountry(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteCountry = (req, res) => {
  try {
    const id = req.params.id;
    countryService.deleteCountry(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

deleteReturn = (req, res) => {
  try {
    const id = req.params.id;
    countryService.deleteReturn(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

getTimeZone = (req, res) => {
  const timeZone = req.query.timeZone;

  if (!timeZone) {
    return res.status(400).json({ error: "timeZone is required" });
  }

  try {
    const now = new Date();

    // التنسيق للوقت بناءً على المنطقة الزمنية المطلوبة
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // عشان تكون 24 ساعة
    });

    // تحويل التوقيت المحلي للمنطقة المطلوبة
    const localTime = formatter.format(now);

    // الحصول على ISO UTC
    const isoUTC = now.toISOString();

    res.json({
      timeZone,
      isoUTC,
      isoCurrent: isoUTC.replace("Z", ""), // لإزالة الـ Z في النهاية
      readable: localTime,
    });
  } catch (error) {
    res.status(400).json({ error: "Invalid timeZone format" });
  }
};


module.exports = {
  getAllData,
  create,
  findById,
  updateCountry,
  deleteCountry,
  deleteReturn,
  getTimeZone,
};
