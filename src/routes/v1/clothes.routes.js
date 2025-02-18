const express = require("express");

const controller = require("../../controllers/clothes.controller");
const clothValidate = require("../../validations/clothes.validation");
const middleware = require("../../middlewares/auth.middleware.js");
const imageUpload = require("../../middlewares/upload/imageUpload.middleware.js");

const router = express.Router();

router.get("", controller.clothes);

router.get("/details/:id", controller.details);

router.get("/cate/:id", controller.clothesByCate);

router.post(
  "/create",
  middleware.auth(["admin"]),
  imageUpload,
  clothValidate.createCloth,
  controller.create
);

router.patch(
  "/edit/:id",
  middleware.auth(["admin"]),
  imageUpload,
  clothValidate.editCloth,
  controller.edit
);

router.delete("/delete/:id", middleware.auth(["admin"]), controller.delete);

module.exports = router;
