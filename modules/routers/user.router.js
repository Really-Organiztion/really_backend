const express = require("express");
const userRouter = express.Router();
const logger = require("../../helpers/logging");
const userController = require("../controllers/user.controller");
const roles = require("../../helpers/roles");

userRouter.post("/all", userController.getAllData);

userRouter.route("/").post((req, res) => {
  // Validation
  userController.createUser(req, res);
});
userRouter.get(
  "/course/:userId/:courseId",
  userController.findUserCourseByCourseId
);
userRouter.get("/purchaseCourses/:id", userController.findUserCourses);
userRouter.get("/purchaseLessons/:id", userController.findUserLessons);
userRouter.post("/purchase/:id", userController.addPurchaseIntoUser);
// userRouter.put(
//   "/purchase/:id",
//   userController.updateUserLessonPurchase
// );
userRouter.get("/favorite/:id", userController.findUserFavorites);
userRouter.put("/favorite/:id", userController.addFavoriteIntoUser);
userRouter.delete("/favorite/:id/:courseId", userController.removeUserFavorite);
userRouter.get(
  "/checkFavorite/:userId/:courseId",
  userController.checkUserCourseInFavorite
);

userRouter.route("/changePassword/:id").put((req, res) => {
  userController.changePassword(req, res);
});
userRouter.route("/updateIdentity/:id").put((req, res) => {
  userController.updateIdentity(req, res);
});

userRouter.route("/changeEmail/:id").put((req, res) => {
  userController.changeEmail(req, res);
});

userRouter.get("/:id", userController.findById);

userRouter.route("/:id").put((req, res) => {
  const id = req.params.id;
  userController.updateUser(req, res, id);
});
userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;
