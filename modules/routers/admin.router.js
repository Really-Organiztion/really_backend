const express = require("express");
const adminRouter = express.Router();
const logger = require("../../helpers/logging");
const adminController = require("../controllers/admin.controller");
const roles = require("../../helpers/roles");

adminRouter.get("/", roles.isAuthenticatedAsAdmin, adminController.getAllData);

adminRouter.route("/").post((req, res) => {
  adminController.createAdmin(req, res);
});
adminRouter.get("/:id", roles.isAuthenticatedAsAdmin, adminController.findById);
adminRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  adminController.updateAdmin
);
adminRouter.put(
  "/updateRole/:id/:admin",
  roles.isAuthenticatedAsAdmin,
  adminController.updateRoleAdmin
);
adminRouter.route("/changePassword/:id").put((req, res) => {

  const id = req.params.id;
  
  adminController.changePassword(req, res, id);

});
adminRouter.delete(
  "/:id/:admin",
  roles.isAuthenticatedAsAdmin,
  adminController.deleteAdmin
);

module.exports = adminRouter;
