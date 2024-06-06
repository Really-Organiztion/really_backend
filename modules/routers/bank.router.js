const express = require("express");
const bankRouter = express.Router();
const bankController = require("../controllers/bank.controller");
const roles = require("../../helpers/roles");

bankRouter.post("/all", bankController.getAllData);
bankRouter.post("/",  bankController.create);

bankRouter.get("/:id",  bankController.findById);
bankRouter.put(
  "/:id",
  bankController.updateBank
);
bankRouter.delete(
  "/:id",
  
  bankController.deleteBank
);

module.exports = bankRouter;
