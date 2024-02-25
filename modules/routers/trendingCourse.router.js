const express = require("express");
const trendingRouter = express.Router();
const trendingController = require("../controllers/trendingCourse.controller");
const roles = require("../../helpers/roles");

trendingRouter.get("/", trendingController.getAllData);
trendingRouter.post(
  "/",
  roles.isAuthenticatedAsAdmin,
  trendingController.create
);
trendingRouter.get(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  trendingController.findById
);
trendingRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  trendingController.updateTrendingCourse
);
trendingRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  trendingController.deleteTrendingCourse
);

module.exports = trendingRouter;
