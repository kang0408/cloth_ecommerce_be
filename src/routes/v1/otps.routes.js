const express = require("express");

const controller = require("../../controllers/otps.controller");
const otpValidate = require("../../validations/otps.validation");

const router = express.Router();

router.post("/send-otp", otpValidate.sendOtp, controller.sendOtp);

router.post("/verify-otp", otpValidate.verifyOtp, controller.verifyOtp);

module.exports = router;
