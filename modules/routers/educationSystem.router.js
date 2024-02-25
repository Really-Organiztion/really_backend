const express = require("express");
const educationSystemRouter = express.Router();
const educationSystemController = require("../controllers/educationSystem.controller");
const roles = require("../../helpers/roles");

educationSystemRouter.get("/", educationSystemController.getAllData);
educationSystemRouter.post(
  "/",
  roles.isAuthenticatedAsAdmin,
  educationSystemController.create
);
educationSystemRouter.get(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  educationSystemController.findById
);
educationSystemRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  educationSystemController.updateEducationSystem
);
educationSystemRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  educationSystemController.deleteEducationSystem
);

module.exports = educationSystemRouter;
