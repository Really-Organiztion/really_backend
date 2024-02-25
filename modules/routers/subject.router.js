const express = require("express");
const subjectRouter = express.Router();
const subjectController = require("../controllers/subject.controller");
const roles = require("../../helpers/roles");

subjectRouter.get("/", subjectController.getAllData);
subjectRouter.post("/", roles.isAuthenticatedAsAdmin, subjectController.create);
subjectRouter.get(
  "/educationSystem/:educationSystemId",
  subjectController.findSubjectByEducationSystem
);
subjectRouter.get(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  subjectController.findById
);
subjectRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  subjectController.updateSubject
);
subjectRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  subjectController.deleteSubject
);

module.exports = subjectRouter;
