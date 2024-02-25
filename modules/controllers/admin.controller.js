const adminService = require("../services/admin.service");
const bcrypt = require("bcryptjs");
const logger = require("../../helpers/logging");
const config = require("../../config/default.json");

getAllData = (req, res) => {
  try {
    adminService.findAll(req, res);
  } catch (error) {
    logger.error(error);
  }
};

createAdmin = (req, res, next) => {
  try {
    if (req.body.password.length < 6) {
      return res.status(403).send("Password must be at least 6 chars");
    }
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return callback(err);
      }
      bcrypt.hash(req.body.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        req.body.password = hash;
        adminService.create(req, res);
      });
    });
  } catch (error) {
    logger.error(error);
  }
};

findById = (req, res) => {
  try {
    const id = req.params.id;
    adminService.findById(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateAdmin = (req, res) => {
  try {
    const id = req.params.id;
    adminService.updateAdmin(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
deleteAdmin = (req, res) => {
  try {
    const id = req.params.id;
    adminService.deleteAdmin(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
identifyAdmin = (req, res) => {
  try {
    adminService.findAdminAccount(req, res);
  } catch (error) {
    logger.error(error);
  }
};
logout = (req, res) => {
  admin = {};
  token = null;
};
function loginAsSuperAdmin() {
  adminService.loginAsSuperAdmin(config.superAdmin.username, (err, data) => {
    if (err || !data)
      adminService.createSuperAdmin((data) => {
        logger.info("Super Admin Created Done");
        return data;
      });
  });
}
findAdminById = async (id) => {
  try {
    return await adminService.findAdminById(id);
  } catch (error) {
    logger.error(error);
  }
};
loginAsSuperAdmin();
module.exports = {
  getAllData,
  createAdmin,
  findById,
  updateAdmin,
  deleteAdmin,
  identifyAdmin,
  logout,
  findAdminById,
};
