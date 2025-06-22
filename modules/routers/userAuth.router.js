const express = require("express"); 
const authRouter = express.Router();
const userController = require("../controllers/user.controller");

// Authentication
authRouter.post("/login", (req, res, next) => {
  userController.identifyUser(req, res);
});

// Authentication with Social Media Accounts
authRouter.post("/social-media-login", (req, res, next) => {
  userController.socialMediaLogin(req, res);
});

// Registration
authRouter.post("/register", (req, res, next) => {
  userController.createUser(req, res);
});
// Registration with Social Media Accounts
authRouter.post("/social-media-register", (req, res, next) => {
  userController.socialMediaRegister(req, res);
});
authRouter.post("/verify-email", (req, res, next) => {
  userController.verifyEmail(req, res);
});
authRouter.post("/generat-opt-email", (req, res, next) => {
  userController.generatOptEmail(req, res);
});
authRouter.get("/get-opt-email", (req, res, next) => {
  userController.getOptEmail(req, res);
});
authRouter.route("/forget-password").put((req, res) => {
  userController.forgetPassword(req, res);
});
authRouter.get("/logout", (req, res, next) => {
  userController.logout(req, res);
});
module.exports = authRouter;
