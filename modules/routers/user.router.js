const express = require("express");
const userRouter = express.Router();
const logger = require("../../helpers/logging");
const userController = require("../controllers/user.controller");

userRouter.get("/", userController.getAllData);

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
  const id = req.params.id;
  userController.changePassword(req, res, id);
});


userRouter.get("/:id", userController.findById);

userRouter.route("/:id").put((req, res) => {
  const id = req.params.id;
  userController.updateUser(req, res, id);
});
userRouter.delete("/:id", userController.deleteUser);

module.exports = userRouter;
