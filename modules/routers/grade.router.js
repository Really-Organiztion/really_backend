const express = require("express");
const gradeRouter = express.Router();
const gradeController = require("../controllers/grade.controller");
const roles = require("../../helpers/roles");

gradeRouter.get("/", gradeController.getAllData);
gradeRouter.post("/", roles.isAuthenticatedAsAdmin, gradeController.create);
gradeRouter.get(
  "/educationSystem/:educationSystemId",
  gradeController.findGradeByEducationSystem
);
gradeRouter.get("/:id", roles.isAuthenticatedAsAdmin, gradeController.findById);
gradeRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  gradeController.updateGrade
);
gradeRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  gradeController.deleteGrade
);

module.exports = gradeRouter;
