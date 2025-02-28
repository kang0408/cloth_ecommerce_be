const express = require("express");

const controller = require("../../controllers/otps.controller");
const otpValidate = require("../../validations/otps.validation");

const router = express.Router();

/**
 * @swagger
 * /otp/send-otp:
 *   post:
 *     summary: Send OTP to Email
 *     description: Sends a One-Time Password (OTP) to the provided email address for verification.
 *     tags:
 *       - OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 required: true
 *                 example: "khangdanh484@gmail.com"
 *                 description: The email address to receive the OTP.
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "OTP sent to email"
 *                 data:
 *                   example: null
 *       400:
 *         description: Invalid email address.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 400
 *               message: "Invalid email format"
 *       404:
 *         description: Email not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 404
 *               message: "Email not found"
 *       500:
 *         description: Internal server error.
 */
router.post("/send-otp", otpValidate.sendOtp, controller.sendOtp);

/**
 * @swagger
 * /otp/verify-otp:
 *   post:
 *     summary: Verify OTP
 *     description: Verifies the OTP sent to the user's email and returns a verification token if successful.
 *     tags:
 *       - OTP
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 required: true
 *                 example: "khangdanh484@gmail.com"
 *                 description: The email address associated with the OTP.
 *               otp:
 *                 type: string
 *                 required: true
 *                 example: "186340"
 *                 description: The one-time password sent to the email.
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Verify OTP successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     verifyToken:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                       description: Token returned after successful OTP verification.
 *       400:
 *         description: Invalid OTP format or OTP expired or incorrect.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 400
 *               message: "Invalid OTP format"
 *       404:
 *         description: Email not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 404
 *               message: "Email not found"
 *       500:
 *         description: Internal server error.
 */
router.post("/verify-otp", otpValidate.verifyOtp, controller.verifyOtp);

module.exports = router;
