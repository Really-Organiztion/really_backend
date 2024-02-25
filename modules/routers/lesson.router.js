const express = require("express");
const lessonRouter = express.Router();
const lessonController = require("../controllers/lesson.controller");

lessonRouter.get("/", lessonController.getAllData);
lessonRouter.post("/", lessonController.create);

lessonRouter.put(
  "/addContentIntoLesson/:id",
  lessonController.addContentIntoLesson
);
lessonRouter.put("/addTaskIntoLesson/:id", lessonController.addTaskIntoLesson);
lessonRouter.put("/addQuizIntoLesson/:id", lessonController.addQuizIntoLesson);
lessonRouter.put(
  "/content/:lessonId/:contentId",
  lessonController.updateContent
);
lessonRouter.put("/task/:lessonId/:taskId", lessonController.updateTask);
lessonRouter.put("/quiz/:lessonId/:quizId", lessonController.updateQuiz);
lessonRouter.delete(
  "/content/:lessonId/:contentId",
  lessonController.deleteContent
);
lessonRouter.delete("/quiz/:lessonId/:quizId", lessonController.deleteQuiz);
lessonRouter.get("/:id", lessonController.findById);
lessonRouter.put("/:id", lessonController.updateLesson);
lessonRouter.delete("/:id", lessonController.deleteLesson);

module.exports = lessonRouter;
