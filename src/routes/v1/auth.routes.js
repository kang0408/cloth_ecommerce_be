const express = require("express");

const controller = require("../../controllers/auth.controller");
const authValidate = require("../../validations/auth.validation");
const middleware = require("../../middlewares/auth.middleware.js");

const router = express.Router();

router.post("/register", authValidate.register, controller.register);

router.post("/login", authValidate.login, controller.login);

router.post("/forgot-password", authValidate.forgot, controller.forgot);

router.post("/reset-password", authValidate.reset, controller.reset);

router.post(
  "/change-password",
  middleware.auth(["user", "admin"]),
  authValidate.change,
  controller.change
);

module.exports = router;
