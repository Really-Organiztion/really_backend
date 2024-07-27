const userService = require("../services/user.service");
const bcrypt = require("bcryptjs");
const logger = require("../../helpers/logging");
const jwt = require("jsonwebtoken");
const roles = require("../../helpers/roles");

getAllData = (req, res) => {
  try {
    userService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

createUser = (req, res, next) => {
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
        userService.create(req, res);
      });
    });
  } catch (error) {
    logger.error(error);
  }
};
socialMediaRegister = (req, res) => {
  try {
    userService.createSocialMedia(req, res);
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
    } else if (req.body.password) {
      return res.status(403).send("Password Cannot be updated");
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
verifyEmail = (req, res) => {
  try {
    userService.verifyEmail(req, res);
  } catch (error) {
    logger.error(error);
  }
};
generatOptEmail = (req, res) => {
  try {
    userService.generatOptEmail(req, res);
  } catch (error) {
    logger.error(error);
  }
};
getOptEmail = (req, res) => {
  try {
    userService.getOptEmail(req, res);
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
  jwt.destroy(roles.getDecodedToken(req.headers));
  res.status(200).send("User logout is susses");
};

changePassword = (req, res) => {
  try {
    const id = req.params.id;
    userService.changePassword(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateIdentity = (req, res) => {
  try {
    const id = req.params.id;
    userService.updateIdentity(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
changeEmail = async (req, res) => {
  try {
    const id = req.params.id;
    let user = await userService.findUserByEmail(req.body.email);
    if (user && user.email === req.body.email) {
      return res.status(400).send("Email is exist");
    }
    userService.changeEmail(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
forgetPassword = (req, res) => {
  try {
    userService.forgetPassword(req, res);
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


deleteUser = (req, res) => {
  try {
    const id = req.params.id;
    userService.deleteUser(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};

deleteReturn = (req, res) => {
  try {
    const id = req.params.id;
    userService.deleteReturn(req, res, id);
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
  deleteReturn,
  identifyUser,
  logout,
  verifyEmail,
  generatOptEmail,
  getOptEmail,
  changePassword,
  updateIdentity,
  changeEmail,
  forgetPassword,
  findUserById,
  socialMediaRegister,
  socialMediaLogin,
};
