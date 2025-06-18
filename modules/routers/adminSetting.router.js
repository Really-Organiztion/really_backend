const express = require("express");
const adminSettingRouter = express.Router();
const adminSettingController = require("../controllers/adminSetting.controller");
const roles = require("../../helpers/roles");

adminSettingRouter.get("/", roles.isAuthenticatedAsSuperAdmin, adminSettingController.getOne);
adminSettingRouter.put(
  "/:id",
  roles.isAuthenticatedAsSuperAdmin,
  adminSettingController.updateAdminSetting
);

module.exports = adminSettingRouter;
