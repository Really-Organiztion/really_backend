const express = require("express");
const image3dRouter = express.Router();
const image3dController = require("../controllers/image3d.controller");
const roles = require("../../helpers/roles");

image3dRouter.post("/", image3dController.create);
image3dRouter.put(
  "/:id",

  image3dController.updateImage3d
);
image3dRouter.delete(
  "/:id",

  image3dController.deleteImage3d
);

module.exports = image3dRouter;
