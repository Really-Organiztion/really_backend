const express = require("express");
const courseRouter = express.Router();
const courseController = require("../controllers/course.controller");
const roles = require("../../helpers/roles");

courseRouter.get("/", courseController.getAllData);
courseRouter.get("/deletedCourses", courseController.getAllDeletedCourses);
courseRouter.get("/newReleases", courseController.getNewReleasesCourses);
courseRouter.get("/exclusives", courseController.getExclusiveCourses);
courseRouter.post("/filter", courseController.filterCourse);
courseRouter.get("/user", courseController.getUserCourses);
courseRouter.get(
  "/teacherCourses/:id",
  courseController.findTeacherCoursesByTeacherId
);
courseRouter.post("/", roles.isAuthenticatedAsAdmin, courseController.create);
courseRouter.get("/:id", courseController.findById);
courseRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  courseController.updateCourse
);
courseRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  courseController.deleteCourse
);

module.exports = courseRouter;
