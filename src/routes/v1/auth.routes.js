const express = require("express");

const controller = require("../../controllers/auth.controller");
const authValidate = require("../../validations/auth.validation");
const middleware = require("../../middlewares/auth.middleware.js");

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *  post:
 *    summary: Register a new user
 *    description: API for registering a new account
 *    tags:
 *      - Auth
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *                example: "khangtran4804"
 *              email:
 *                type: string
 *                example: "khangkhang444@gmail.com"
 *              password:
 *                type: string
 *                example: "Abc@12345"
 *              role:
 *                type: string
 *                example: "user"
 *            required:
 *              - username
 *              - email
 *              - password
 *    responses:
 *      200:
 *        description: Register successfully
 *        content:
 *          application/json:
 *            example:
 *              success: true
 *              message: "Register successfully"
 *              data: null
 *      400:
 *        description: Invalid input data
 *        content:
 *          application/json:
 *            example:
 *              success: false
 *              code: 400
 *              message: "Email already exist"
 *      500:
 *        description: Internal server error
 */
router.post("/register", authValidate.register, controller.register);

/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: Login by email
 *    description: API for user to login
 *    tags:
 *      - Auth
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: "khangkhang444@gmail.com"
 *              password:
 *                type: string
 *            required:
 *              - email
 *              - password
 *    responses:
 *      200:
 *        description: Login successfully
 *        content:
 *          application/json:
 *            example:
 *              success: true
 *              message: "Login successfully"
 *              data: {
 *                "id": "67aeaf64d29a2d3cfebc1256",
 *                "role": "admin",
 *                "accesstoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YWVhZjY0ZDI5YTJkM2NmZWJjMzRhNyIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc0MDYyNjkxMiwiZXhwIjoxNzQwODg2MTEyfQ.ubFOS3sKbNyZyW93NnwzzsoHVqrHzGAArWWIuSbgRjK"
 *              }
 *      400:
 *        description: Password is not correct or invalid input data
 *        content:
 *          application/json:
 *            example:
 *              success: false
 *              code: 400
 *              message: "Password is not correct"
 *      500:
 *        description: Internal server error
 */
router.post("/login", authValidate.login, controller.login);

/**
 * @swagger
 * /auth/forgot-password:
 *  post:
 *    summary: Send request to reset a password
 *    description: API for forgot password
 *    tags:
 *      - Auth
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: "khangkhang444@gmail.com"
 *            required:
 *              - email
 *    responses:
 *      200:
 *        description: OTP sent to email
 *        content:
 *          application/json:
 *            example:
 *              success: true
 *              message: "OTP sent to email"
 *              data: null
 *      400:
 *        description: Email does not exist
 *        content:
 *          application/json:
 *            example:
 *              success: false
 *              code: 400
 *              message: "Email already exist"
 *      500:
 *        description: Internal server error
 */
router.post("/forgot-password", authValidate.forgot, controller.forgot);

/**
 * @swagger
 * /auth/reset-password:
 *  post:
 *    summary: Reset a password
 *    description: API for reseting a password
 *    tags:
 *      - Auth
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              newPassword:
 *                type: string
 *                example: "Abc@1234567890"
 *              verifyToken:
 *                type: string
 *                example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImtoYW5nZGFuaDQ4NEBnbWFpbC5jb20iLCJpYXQiOjE3Mzk3NzUzMjAsImV4cCI6MTczOTc3NTYyMH0.i6yHH2NDPC1JqTlvTWwfroC_C9gQ3CUMXjMQzTQ4Wa2"
 *            required:
 *              - newPassword
 *              - verifyToken
 *    responses:
 *      200:
 *        description: Reset password successfully
 *        content:
 *          application/json:
 *            example:
 *              success: true
 *              message: "Reset password successfully"
 *              data: null
 *      400:
 *        description: Invalid input data or invalid verify token or email does not exist
 *        content:
 *          application/json:
 *            example:
 *              success: false
 *              code: 400
 *              message: "Email does not exist"
 *      500:
 *        description: Internal server error
 */
router.post("/reset-password", authValidate.reset, controller.reset);

/**
 * @swagger
 * /auth/change-password:
 *  post:
 *    summary: Change user password
 *    description: API for changing the user's password (requires authentication)
 *    tags:
 *      - Auth
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              oldPassword:
 *                type: string
 *                example: "oldpassword123"
 *              newPassword:
 *                type: string
 *                example: "newpassword456"
 *            required:
 *              - oldPassword
 *              - newPassword
 *    responses:
 *      200:
 *        description: Change password successfully
 *        content:
 *          application/json:
 *            example:
 *              success: true
 *              message: "Change password successfully"
 *              data: null
 *      400:
 *        description: Invalid input data or Email does not exist or Old password is not correct
 *        content:
 *          application/json:
 *            example:
 *              success: false
 *              code: 400
 *              message: "Old password is not correct"
 *      500:
 *        description: Internal server error
 */
router.post(
  "/change-password",
  middleware.auth(["user", "admin"]),
  authValidate.change,
  controller.change
);

module.exports = router;
