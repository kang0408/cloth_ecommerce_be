const express = require("express");

const controller = require("../../controllers/users.controller");
const userValidate = require("../../validations/users.validation.js");
const middleware = require("../../middlewares/auth.middleware.js");
const imageUpload = require("../../middlewares/upload/imageUpload.middleware.js");

const router = express.Router();

router.get("", middleware.auth(["admin"]), controller.users);

router.get("/profile", middleware.auth(["user", "admin"]), controller.profile);

router.post(
  "/create",
  middleware.auth(["admin"]),
  imageUpload,
  userValidate.create,
  controller.create
);

router.post(
  "/edit/:id",
  middleware.auth(["admin"]),
  imageUpload,
  userValidate.edit,
  controller.edit
);

router.delete("/delete/:id", middleware.auth(["admin"]), controller.delete);

module.exports = router;
