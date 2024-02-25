const userService = require("../services/user.service");
const bcrypt = require("bcryptjs");
const logger = require("../../helpers/logging");
const courseController = require("./course.controller");

getAllData = (req, res) => {
  try {
    userService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

createUser = (req, res, next) => {
  console.log("zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
  try {
    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
    if (req.body.password.length < 6) {
      return res.status(403).send("Password must be at least 6 chars");
    }
    if (req.body.password != req.body.confirmPassword)
      return res.status(403).send("Password is not equal to confirm password");
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return callback(err);
      }
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        req.body.password = hash;
        delete req.body.confirmPassword;
        userService.create(req, res);
      });
    });
  } catch (error) {
    logger.error(error);
  }
};
socialMediaRegister = (req, res) => {
  try {
    userService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};
findById = (req, res) => {
  try {
    const id = req.params.id;
    userService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateUser = (req, res) => {
  try {
    const id = req.params.id;
    if (req.body.email) {
      return res.status(403).send("Email Cannot be updated");
    }
    userService.updateUser(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteUser = (req, res) => {
  try {
    const id = req.params.id;
    userService.deleteUser(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
identifyUser = (req, res) => {
  try {
    userService.findUserAccount(req, res);
  } catch (error) {
    logger.error(error);
  }
};
socialMediaLogin = (req, res) => {
  try {
    userService.socialMediaLogin(req, res);
  } catch (error) {
    logger.error(error);
  }
};
logout = (req, res) => {
  user = {};
  token = null;
};
addPurchaseIntoUser = async (req, res) => {
  try {
    const id = req.params.id;
    try {
      let result = await courseController.addUserIntoCourse(
        req.body.courseId,
        id
      );
      if (result)
        userService.addPurchaseIntoUser(req, res, id, "default");
    } catch (error) {
      res.send(error);
    }
  } catch (error) {
    logger.error(error);
  }
};
addPurchaseIntoUserByCode = async (req, res) => {
  try {
    const id = req.body.userId;
    try {
      let result = await courseController.addUserIntoCourse(
        req.body.courseId,
        id
      );
      if (result)
        return userService.addPurchaseIntoUser(req, res, id, "other");
    } catch (error) {
      res.send(error);
    }
  } catch (error) {
    logger.error(error);
  }
};
findUserCourses = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await userService.findUserCourses(req, res, id);
    if (result) {
      req.body.courses = result[0].courses;
      req.body.lessons = result[0].lessons;
      courseController.getUserCourses(req, res);
    }
  } catch (error) {
    logger.error(error);
  }
};
findUserLessons = (req, res) => {
  try {
    const id = req.params.id;
    userService.findUserLessons(req, res, id, "default");
  } catch (error) {
    logger.error(error);
  }
};
addFavoriteIntoUser = (req, res) => {
  try {
    const id = req.params.id;
    userService.addFavoriteIntoUser(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
removeUserFavorite = (req, res) => {
  try {
    const id = req.params.id;
    const courseId = req.params.courseId;
    userService.removeUserFavorite(req, res, id, courseId);
  } catch (error) {
    logger.error(error);
  }
};
findUserFavorites = async (req, res) => {
  try {
    const id = req.params.id;
    let result = await userService.findUserFavorites(req, res, id);
    if (result) {
      req.body.courses = result;
      courseController.getUserCourses(req, res);
    }
  } catch (error) {
    logger.error(error);
  }
};
checkUserCourseInFavorite = (req, res) => {
  try {
    const userId = req.params.userId;
    const courseId = req.params.courseId;
    userService.checkUserCourseInFavorite(req, res, userId, courseId);
  } catch (error) {
    logger.error(error);
  }
};
changePassword = (req, res) => {
  try {
    const id = req.params.id;
    userService.changePassword(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateUserLessonPurchase = (req, res) => {
  try {
    return userService.updateUserLessonPurchase(req, res);
  } catch (error) {
    logger.error(error);
  }
};
findUserCourseByCourseId = async (req, res) => {
  try {
    const userId = req.params.userId;
    const courseId = req.params.courseId;
    let course = await courseController.findUserCourseById(
      req,
      res,
      courseId
    );
    let userLessons = await userService.findUserLessons(
      req,
      res,
      userId,
      "other"
    );
    let obj = {
      course: course[0],
      userLessons: userLessons[0],
    };
    res.send(obj);
  } catch (error) {
    logger.error(error);
  }
};
findUserById = async (id) => {
  try {
    return await userService.findUserById(id);
  } catch (error) {
    logger.error(error);
  }
};
addPromoIntoUser = (req, res) => {
  try {
    return userService.addPromoIntoUser(req, res);
  } catch (error) {
    logger.error(error);
  }
};
module.exports = {
  getAllData,
  createUser,
  findById,
  updateUser,
  deleteUser,
  identifyUser,
  logout,
  addPurchaseIntoUser,
  findUserCourses,
  findUserLessons,
  addFavoriteIntoUser,
  findUserFavorites,
  changePassword,
  updateUserLessonPurchase,
  findUserCourseByCourseId,
  checkUserCourseInFavorite,
  findUserById,
  addPurchaseIntoUserByCode,
  removeUserFavorite,
  socialMediaRegister,
  socialMediaLogin,
  addPromoIntoUser,
};
