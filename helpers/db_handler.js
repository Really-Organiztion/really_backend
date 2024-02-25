const mongoose = require("mongoose");
const config = require("config");
const logger = require("./logging");

module.exports = function () {
  let db = process.env.MONGODB_URI || "mongodb://localhost:27017/ReallyBooking";

  mongoose
    .connect(db, {
    
    })
    .then(() => {
      logger.info(`The server connecting properly with Mongo DB URL at ${db}`);
    })
    .catch((err) => logger.error("Could not connect to mongo db...", err));
};
