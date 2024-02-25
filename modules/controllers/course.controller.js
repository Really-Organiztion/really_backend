const courseService = require("../services/course.service");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    req.body.isDeleted = false;
    courseService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};
getAllDeletedCourses = (req, res) => {
  try {
    req.body.isDeleted = true;
    courseService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};
create = (req, res) => {
  try {
   
        courseService.create(req, res);
    
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    courseService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateCourse = (req, res) => {
  try {
    const id = req.params.id;
    courseService.updateCourse(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteCourse = (req, res) => {
  try {
    const id = req.params.id;
    courseService.deleteCourse(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
findTeacherCoursesByTeacherId = (req, res) => {
  try {
    const id = req.params.id;
    courseService.findTeacherCoursesByTeacherId(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
getNewReleasesCourses = (req, res) => {
  try {
    courseService.getNewReleasesCourses(req, res);
  } catch (error) {
    logger.error(error);
  }
};
getUserCourses = (req, res) => {
  try {
    courseService.getUserCourses(req, res);
  } catch (error) {
    logger.error(error);
  }
};
getExclusiveCourses = (req, res) => {
  try {
    courseService.getExclusiveCourses(req, res);
  } catch (error) {
    logger.error(error);
  }
};
filterCourse = (req, res) => {
  try {
    courseService.filterCourse(req, res);
  } catch (error) {
    logger.error(error);
  }
};
findUserCourseById = (req, res, id) => {
  try {
    return courseService.findUserCourseById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
addUserIntoCourse = (courseId, userId) => {
  try {
    return courseService.addUserIntoCourse(courseId, userId);
  } catch (error) {
    logger.error(error);
  }
};
module.exports = {
  getAllData,
  create,
  findById,
  updateCourse,
  deleteCourse,
  getAllDeletedCourses,
  findTeacherCoursesByTeacherId,
  getNewReleasesCourses,
  getUserCourses,
  getExclusiveCourses,
  filterCourse,
  findUserCourseById,
  addUserIntoCourse,
};
