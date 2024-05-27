const express = require("express");
const bookingRouter = express.Router();
const bookingController = require("../controllers/booking.controller");
const roles = require("../../helpers/roles");

bookingRouter.post("/all", bookingController.getAllData);
bookingRouter.post("/",  bookingController.create);

bookingRouter.get("/:id",  bookingController.findById);
bookingRouter.put(
  "/:id",
  bookingController.updateBooking
);
bookingRouter.put(
  "/updateStatus/:id",
  
  bookingController.updateBookingStatus
);
bookingRouter.delete(
  "/:id",
  
  bookingController.deleteBooking
);

module.exports = bookingRouter;
