const express = require("express");

const controller = require("../../controllers/wishlists.controller");
const middleware = require("../../middlewares/auth.middleware.js");

const router = express.Router();

/**
 * @swagger
 * /wishlists:
 *   get:
 *     summary: Get user wishlist
 *     description: Retrieve the list of favorite products of the authenticated user.
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved wishlist.
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
 *                   example: "Get wishlist successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67b83382acf5ad9181962417"
 *                     wishlist:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "67b4492a563d3c48c678e042"
 *                           title:
 *                             type: string
 *                             example: "Quần áo mới 16"
 *                           description:
 *                             type: string
 *                             example: "Mô tả quần áo 16"
 *                           price:
 *                             type: number
 *                             example: 2000
 *                           discountPercentage:
 *                             type: number
 *                             example: 15
 *                           stock:
 *                             type: integer
 *                             example: 0
 *                           thumbnail:
 *                             type: string
 *                             example: "thumbnail"
 *                           status:
 *                             type: string
 *                             enum: [active, inactive]
 *                             example: "active"
 *                           deleted:
 *                             type: boolean
 *                             example: false
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-18T08:47:38.546Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-18T08:47:38.546Z"
 *                           categories:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: ["65c892f1a2b3c4d5e6f70111"]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-21T08:04:18.418Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-21T08:14:52.449Z"
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 401
 *               message: "Access Denied. Please login or register account"
 *       500:
 *         description: Internal server error.
 */
router.get("", middleware.auth(["user", "admin"]), controller.getAll);

/**
 * @swagger
 * /wishlists/add/{id}:
 *   post:
 *     summary: Add product to wishlist
 *     description: Add a product to the user's wishlist. Requires authentication.
 *     tags:
 *       - Wishlist
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to add to the wishlist.
 *         schema:
 *           type: string
 *           example: "67b4492a563d3c48c678e042"
 *     responses:
 *       200:
 *         description: Successfully added product to wishlist.
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
 *                   example: "Add wishlist successfully"
 *                 data:
 *                   type: number
 *                   example: 200
 *       400:
 *         description: Bad request - Product may already be in the wishlist or invalid product ID.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 400
 *               message: "Product already in wishlist"
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 401
 *               message: "Access Denied. Please login or register account"
 *       404:
 *         description: Not found - Product does not exist.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 404
 *               message: "Product not found"
 *       500:
 *         description: Internal server error.
 */
router.post("/add/:id", middleware.auth(["user", "admin"]), controller.add);

module.exports = router;
