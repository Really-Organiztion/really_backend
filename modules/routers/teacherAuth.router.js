const express = require("express");
const authRouter = express.Router();
const teacherController = require("../controllers/teacher.controller");

// Authentication
authRouter.post("/login", (req, res) => {
  teacherController.identifyTeacher(req, res);
});

// Authentication with Social Media Accounts
authRouter.post("/socialMediaLogin", (req, res) => {
  teacherController.socialMediaLogin(req, res);
});

// Registration
authRouter.post("/register", (req, res) => {
  teacherController.createTeacher(req, res);
});

// Registration with Social Media Accounts
authRouter.post("/socialMediaRegister", (req, res) => {
  teacherController.socialMediaRegister(req, res);
});

authRouter.get("/logout", (req, res) => {
  teacherController.logout(req, res);
});
module.exports = authRouter;
