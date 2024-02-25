const express = require("express");
const codeRouter = express.Router();
const codeController = require("../controllers/code.controller");
const roles = require("../../helpers/roles");

codeRouter.get("/", roles.isAuthenticatedAsAdmin, codeController.getAllData);
codeRouter.post("/", roles.isAuthenticatedAsAdmin, codeController.create);
codeRouter.get("/checkCode", codeController.checkCode);
codeRouter.get("/:id", roles.isAuthenticatedAsAdmin, codeController.findById);
codeRouter.put("/:id", roles.isAuthenticatedAsAdmin, codeController.updateCode);
codeRouter.delete(
  "/:id",
  roles.isAuthenticatedAsAdmin,
  codeController.deleteCode
);

module.exports = codeRouter;
