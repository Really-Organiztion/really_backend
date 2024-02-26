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
changePassword = (req, res) => {
  try {
    const id = req.params.id;
    adminService.changePassword(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateAdmin = (req, res) => {
  try {
    const id = req.params.id;
    delete req.body.role;
    delete req.body.isDeleted;
    delete req.body.password;

    adminService.updateAdmin(req, res, id);
  } catch (error) {
    logger.error(error);
  }
};
updateRoleAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = req.params.admin;
    let userAdmin = await adminService.findAdminById(admin);
    let user = await adminService.findAdminById(id);
    if (!req.body || !req.body.role) {
      return res.status(403).send("The roll must be sent in role");
    }
    if (userAdmin && user) {
      if (user.role > userAdmin.role && req.body.role > userAdmin.role) {
        req.body = { role: req.body.role };
        adminService.updateAdminRole(req, res, id);
      } else {
        return res
          .status(403)
          .send("The user does not have permission to update role");
      }
    } else {
      return res.status(403).send("User not found");
    }
  } catch (error) {
    logger.error(error);
  }
};
deleteAdmin = async (req, res) => {
  try {
    const id = req.params.id;
    const admin = req.params.admin;
    let userAdmin = await adminService.findAdminById(admin);
    let user = await adminService.findAdminById(id);
    if (userAdmin && user) {
      if (user.role > userAdmin.role) {
        adminService.deleteAdmin(req, res, id);
      } else {
        return res
          .status(403)
          .send("The user does not have permission to delete");
      }
    } else {
      return res.status(403).send("User not found");
    }
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
  updateRoleAdmin,
  deleteAdmin,
  identifyAdmin,
  logout,
  findAdminById,
  changePassword,
};
