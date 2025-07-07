const express = require("express");
const userRouter = express.Router();
const logger = require("../../helpers/logging");
const userController = require("../controllers/user.controller");
const roles = require("../../helpers/roles");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

userRouter.post("/all", userController.getAllData);

userRouter.route("/").post((req, res) => {
  userController.createUser(req, res);
});

userRouter.delete("/:id", userController.deleteUser);
userRouter.put("/delete-return/:id", userController.deleteReturn);

userRouter.route("/change-password/:id").put((req, res) => {
  userController.changePassword(req, res);
});
userRouter.route("/update-identity/:id").put((req, res) => {
  userController.updateIdentity(req, res);
});

userRouter.route("/change-email/:id").put((req, res) => {
  userController.changeEmail(req, res);
});
userRouter.post("/send-email",upload.array('files'), userController.sendEmail);

userRouter.get("/:id", userController.findById);

userRouter.route("/:id").put((req, res) => {
  const id = req.params.id;
  userController.updateUser(req, res, id);
});
userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;
