import express from "express";

import * as controller from "../../controllers/users.controller";
import * as userValidate from "../../validations/users.validation";
import * as middleware from "../../middlewares/auth.middleware";
import imageUpload from "../../middlewares/upload/imageUpload.middleware";

import catchAsync from "../../utils/catchAsync.utils";
``;
const router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a paginated and sorted list of users with their details. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number for pagination.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 5
 *         description: Number of users per page.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [username, email, role, createdAt, updatedAt]
 *           example: "createdAt"
 *         description: The field to sort by.
 *       - in: query
 *         name: sortValue
 *         description: Sort in descending or ascending order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search string
 *     responses:
 *       200:
 *         description: Successfully retrieved the user list.
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
 *                   example: "Get all users successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "67aea804800ed897c554be4d"
 *                           username:
 *                             type: string
 *                             example: "kangtran4804"
 *                           email:
 *                             type: string
 *                             example: "khangdanh484@gmail.com"
 *                           role:
 *                             type: string
 *                             enum: ["user", "admin"]
 *                             example: "user"
 *                           avatar:
 *                             type: string
 *                             nullable: true
 *                             example: "https://res.cloudinary.com/dt8cirdvr/image/upload/v1739894779/k2rpxollbnpp7mxpf4cx.jpg"
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-14T02:18:44.579Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-17T07:14:56.933Z"
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 401
 *               message: "Access Denied. Please login or register account"
 *       500:
 *         description: Internal server error.
 */
router.get("", middleware.auth(["admin"]), catchAsync(controller.users));

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the authenticated user's profile information. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile.
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
 *                   example: "Get profile successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67aeaf64d29a2d3cfebc34a7"
 *                     username:
 *                       type: string
 *                       example: "kangtran4804"
 *                     email:
 *                       type: string
 *                       example: "trandanhkhang482004@gmail.com"
 *                     role:
 *                       type: string
 *                       enum: ["user", "admin"]
 *                       example: "admin"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-14T02:50:12.931Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-14T02:50:12.931Z"
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 401
 *               message: "Access Denied. Please login or register account"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 500
 *               message: "Internal server error"
 */
router.get("/profile", middleware.auth(["user", "admin"]), catchAsync(controller.profileByAuth));

/**
 * @swagger
 * /users/profile/{id}:
 *   get:
 *     summary: Get user profile by id
 *     description: Retrieve the authenticated user's profile information by user id. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user.
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile.
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
 *                   example: "Get profile successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67aeaf64d29a2d3cfebc34a7"
 *                     username:
 *                       type: string
 *                       example: "kangtran4804"
 *                     email:
 *                       type: string
 *                       example: "trandanhkhang482004@gmail.com"
 *                     role:
 *                       type: string
 *                       enum: ["user", "admin"]
 *                       example: "admin"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-14T02:50:12.931Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-14T02:50:12.931Z"
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 401
 *               message: "Access Denied. Please login or register account"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 500
 *               message: "Internal server error"
 */
router.get("/profile/:id", middleware.auth(["admin"]), catchAsync(controller.profileById));

/**
 * @swagger
 * /users/create:
 *   post:
 *     summary: Create a new user
 *     description: Create a new user account. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 required: true
 *                 example: "newuser123"
 *               email:
 *                 type: string
 *                 format: email
 *                 required: true
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "securepassword123"
 *               role:
 *                 type: string
 *                 enum: ["user", "admin"]
 *                 example: "user"
 *     responses:
 *       201:
 *         description: User created successfully.
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
 *                   example: "Create user successfully"
 *                 data:
 *                   example: null
 *       400:
 *         description: Invalid input data or Email is existed.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 400
 *               message: "Invalid input data"
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 401
 *               message: "Access Denied. Please login or register account"
 *       500:
 *         description: Internal server error.
 */
router.post(
  "/create",
  middleware.auth(["admin"]),
  imageUpload,
  userValidate.create,
  controller.create
);

/**
 * @swagger
 * /users/edit/{id}:
 *   patch:
 *     summary: Edit user by ID
 *     description: Update user details by providing new information. Requires authentication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the user to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "updateduser123"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "updateduser@example.com"
 *               role:
 *                 type: string
 *                 enum: ["user", "admin"]
 *                 example: "admin"
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Upload a new profile picture for the user.
 *     responses:
 *       200:
 *         description: User updated successfully.
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
 *                   example: "Edit user successfully"
 *                 data:
 *                   example: null
 *       400:
 *         description: Invalid input data.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 400
 *               message: "Invalid input data"
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 401
 *               message: "Access Denied. Please login or register account"
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 404
 *               message: "User not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 500
 *               message: "Internal server error"
 */
router.patch(
  "/edit/:id",
  middleware.auth(["admin"]),
  imageUpload,
  userValidate.edit,
  catchAsync(controller.edit)
);

/**
 * @swagger
 * /users/update-profile:
 *   patch:
 *     summary: Update user by auth
 *     description: Update user details by providing new information. Requires authorication.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "updateduser123"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "updateduser@example.com"
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Upload a new profile picture for the user.
 *     responses:
 *       200:
 *         description: User updated successfully.
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
 *                   example: "User updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67aeaf64d29a2d3cfebc34a7"
 *                     username:
 *                       type: string
 *                       example: "kangtran4804"
 *                     email:
 *                       type: string
 *                       example: "trandanhkhang482004@gmail.com"
 *                     role:
 *                       type: string
 *                       enum: ["user", "admin"]
 *                       example: "admin"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-14T02:50:12.931Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-14T02:50:12.931Z"
 *       400:
 *         description: Invalid input data or Email is existed.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 400
 *               message: "Invalid input data"
 *       401:
 *         description: Unauthorized - Missing or invalid token.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 401
 *               message: "Access Denied. Please login or register account"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 404
 *               message: "User not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 500
 *               message: "Internal server error"
 */
router.patch(
  "/update-profile",
  middleware.auth(["user", "admin"]),
  imageUpload,
  userValidate.edit,
  catchAsync(controller.updateProfileByAuth)
);

/**
 * @swagger
 * /categories/delete/{id}:
 *   delete:
 *     summary: Delete a specific user
 *     description: API for deleting a specific user item by its ID
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delete user successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Delete user successfully"
 *               data: null
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 404
 *               message: "User not found"
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:id", middleware.auth(["admin"]), catchAsync(controller.deleteUser));

export default router;
