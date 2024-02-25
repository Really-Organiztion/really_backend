const express = require("express");
const authRouter = express.Router();
const adminController = require("../controllers/admin.controller");

// Authentication
authRouter.post("/login", (req, res, next) => {

      adminController.identifyAdmin(req, res);
  
});

// Registration
authRouter.post("/register", (req, res, next) => {
 
      adminController.createAdmin(req, res);
 
});

authRouter.get("/logout", (req, res, next) => {
  adminController.logout(req, res);
});
module.exports = authRouter;
