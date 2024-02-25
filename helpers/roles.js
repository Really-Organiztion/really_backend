const jwt = require("jwt-simple");
const adminController = require("../modules/controllers/admin.controller");
const teacherController = require("../modules/controllers/teacher.controller");
const userController = require("../modules/controllers/user.controller");

const getToken = (headers) => {
  if (headers && headers.authorization) {
    let parted = headers.authorization.split("Bearer ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

const getDecodedToken = (headers) => {
  try {
    return jwt.decode(getToken(headers), process.env.SECRET);
  } catch (ex) {
    return null;
  }
};

const isAuthenticatedAsTeacher = async (req, res, next) => {
  const decodedData = getDecodedToken(req.headers);
  if (decodedData) {
    let result = await teacherController.findTeacherById(decodedData.id);
    if (result) next();
    else res.sendStatus(401);
  } else res.sendStatus(401);
};

const isAuthenticatedAsUser = async (req, res, next) => {
  const decodedData = getDecodedToken(req.headers);
  if (decodedData) {
    let result = await userController.findUserById(decodedData.id);
    if (result) next();
    else res.sendStatus(401);
  } else res.sendStatus(401);
};

const isAuthenticatedAsAdmin = async (req, res, next) => {
  const decodedData = getDecodedToken(req.headers);
  if (decodedData) {
    let result = await adminController.findAdminById(decodedData.id);
    if (result) next();
    else res.sendStatus(401);
  } else res.sendStatus(401);
};

module.exports = {
  getToken,
  getDecodedToken,
  isAuthenticatedAsTeacher,
  isAuthenticatedAsAdmin,
  isAuthenticatedAsUser,
};
