const express = require("express");

const controller = require("../../controllers/auth.controller");
const authValidate = require("../../validations/auth.validation");

const router = express.Router();

router.post("/register", authValidate.register, controller.register);

router.post("/login", authValidate.login, controller.login);

module.exports = router;
