const teacherService = require("../services/teacher.service");
const bcrypt = require("bcryptjs");
const logger = require("../../helpers/logging");

getAllData = (req, res) => {
  try {
    teacherService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};
createTeacher = (req, res, next) => {
  try {
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
        teacherService.create(req, res);
      });
    });
  } catch (error) {
    logger.error(error);
  }
};
socialMediaRegister = (req, res) => {
  try {
    teacherService.create(req, res);
  } catch (error) {
    logger.error(error);
  }
};
findById = (req, res) => {
  try {
    const id = req.params.id;
    teacherService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateTeacher = (req, res, id) => {
  try {
    if (req.body.email) {
      return res.status(403).send("Email Cannot be updated");
    }
    teacherService.updateTeacher(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteTeacher = (req, res) => {
  try {
    const id = req.params.id;
    teacherService.deleteTeacher(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
identifyTeacher = (req, res) => {
  try {
    teacherService.findTeacherAccount(req, res);
  } catch (error) {
    logger.error(error);
  }
};
socialMediaLogin = (req, res) => {
  try {
    teacherService.socialMediaLogin(req, res);
  } catch (error) {
    logger.error(error);
  }
};
logout = (req, res) => {
  teacher = {};
  token = null;
};
findAllApprovedTeachers = (req, res) => {
  try {
    teacherService.findAllApprovedTeachers(req, res);
  } catch (error) {
    logger.error(error);
  }
};
updateTeacherPersonalImage = (req, res, id) => {
  try {
    teacherService.updateTeacherPersonalImage(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
changePassword = (req, res, id) => {
  try {
    teacherService.changePassword(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateTeacherStatus = (req, res, id) => {
  try {
    teacherService.updateTeacherStatus(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
findTeacherById = async (id) => {
  try {
    return await teacherService.findTeacherById(id);
  } catch (error) {
    logger.error(error);
  }
};
module.exports = {
  getAllData,
  createTeacher,
  findById,
  updateTeacher,
  deleteTeacher,
  identifyTeacher,
  logout,
  findAllApprovedTeachers,
  updateTeacherPersonalImage,
  changePassword,
  updateTeacherStatus,
  findTeacherById,
  socialMediaLogin,
  socialMediaRegister,
};
