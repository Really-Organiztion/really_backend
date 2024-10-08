const express = require("express");
const router = express.Router();
const passport = require("passport");
router.use(passport.initialize());
router.use(passport.session());

require("./helpers/passport")(passport);

const errorMiddleware = require("./helpers/error");

const routes = require("./modules/routes");
const userAuthRouter = require("./modules/routers/userAuth.router");
const countryRouter = require("./modules/routers/country.router");
const publicRouter = require("./modules/routers/public.router");
const serviceTypeRouter = require("./modules/routers/serviceType.router");
const uploadFileRouter = require("./modules/routers/uploadFile.router");
const adminAuthRouter = require("./modules/routers/adminAuth.router");
const paymentRouter = require("./modules/routers/payment.router");

router.use("/public", publicRouter);
router.use("/userAuth", userAuthRouter);
router.use("/adminAuth", adminAuthRouter);
router.use("/country", countryRouter);
router.use("/serviceType", serviceTypeRouter);
router.use("/uploadFile", uploadFileRouter);
router.use("/payment", paymentRouter);

router.use(
  passport.authenticate("jwt", {
    session: false,
  })
);

router.use("/", routes);

router.use(errorMiddleware);

module.exports = router;
