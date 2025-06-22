const express = require("express");
const bookingRouter = express.Router();
const bookingController = require("../controllers/booking.controller");
const roles = require("../../helpers/roles");

bookingRouter.post("/",  bookingController.create);
bookingRouter.post("/all",  bookingController.getAllDataPrivate);

bookingRouter.get("/:id",  bookingController.findById);
bookingRouter.put(
  "/:id",
  bookingController.updateBooking
);
bookingRouter.put(
  "/update-status/:id",
  bookingController.updateBookingStatus
);
bookingRouter.put(
  "/update-receipt-status/:type/:id",
  
  bookingController.updateReceiptStatus
);
bookingRouter.delete(
  "/:id",
  
  bookingController.deleteBooking
);

module.exports = bookingRouter;
