const express = require("express");
const authRouter = express.Router();
const adminController = require("../controllers/admin.controller");
const roles = require("../../helpers/roles");

authRouter.post("/login", (req, res, next) => {
  adminController.identifyAdmin(req, res);
});

authRouter.post("/register", roles.isAuthenticatedAsAdmin, (req, res, next) => {
  adminController.createAdmin(req, res);
});


authRouter.get("/logout", roles.logOut);


module.exports = authRouter;
