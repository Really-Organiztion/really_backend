const express = require("express");
const chapterRouter = express.Router();
const chapterController = require("../controllers/chapter.controller");
const roles = require("../../helpers/roles");

chapterRouter.get(
  "/",
  roles.isAuthenticatedAsAdmin,
  chapterController.getAllData
);
chapterRouter.post("/", roles.isAuthenticatedAsAdmin, chapterController.create);
chapterRouter.get(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  chapterController.findById
);
chapterRouter.put(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  chapterController.updateChapter
);
chapterRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  chapterController.deleteChapter
);

module.exports = chapterRouter;
