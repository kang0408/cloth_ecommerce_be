import express from "express";

import * as controller from "../../controllers/cart.controller";
import * as cartValidate from "../../validations/cart.validation";
import * as middleware from "../../middlewares/auth.middleware";

import catchAsync from "../../utils/catchAsync.utils";

const router = express.Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user cart
 *     description: Retrieve the shopping cart of the authenticated user.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved the cart.
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
 *                   example: "Get cart successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67c17554f73ba67f6af8f82d"
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "67a57c2e54dd02487ee3e2fc"
 *                               title:
 *                                 type: string
 *                                 example: "Quần short nam"
 *                               description:
 *                                 type: string
 *                                 example: "Quần short nam năng động, phù hợp mùa hè"
 *                               price:
 *                                 type: number
 *                                 example: 220000
 *                               discountPercentage:
 *                                 type: number
 *                                 example: 10
 *                               stock:
 *                                 type: number
 *                                 example: 45
 *                               status:
 *                                 type: string
 *                                 example: "inactive"
 *                               deleted:
 *                                 type: boolean
 *                                 example: false
 *                               thumbnail:
 *                                 type: string
 *                                 example: "https://example.com/quan-short-nam.jpg"
 *                               rating:
 *                                 type: object
 *                                 properties:
 *                                   like:
 *                                     type: number
 *                                     example: 160
 *                                   dislike:
 *                                     type: number
 *                                     example: 5
 *                     totalPrice:
 *                       type: number
 *                       example: 1100000
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-28T08:35:32.252Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-28T08:40:50.389Z"
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
router.get("", middleware.auth(["user", "admin"]), catchAsync(controller.getCart));

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Add product to cart
 *     description: Add a product to the user's cart. Requires authentication.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to add to the cart.
 *                 example: "67a57c2e54dd02487ee3e2fc"
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product to add.
 *                 example: 5
 *     responses:
 *       200:
 *         description: Successfully added product to cart.
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
 *                   example: "Cloth added to cart"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67c17554f73ba67f6af8f82d"
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "67a57c2e54dd02487ee3e2fc"
 *                               title:
 *                                 type: string
 *                                 example: "Quần short nam"
 *                               description:
 *                                 type: string
 *                                 example: "Quần short nam năng động, phù hợp mùa hè"
 *                               price:
 *                                 type: number
 *                                 example: 220000
 *                               discountPercentage:
 *                                 type: number
 *                                 example: 10
 *                               stock:
 *                                 type: number
 *                                 example: 45
 *                               status:
 *                                 type: string
 *                                 example: "inactive"
 *                               deleted:
 *                                 type: boolean
 *                                 example: false
 *                               thumbnail:
 *                                 type: string
 *                                 example: "https://example.com/quan-short-nam.jpg"
 *                               rating:
 *                                 type: object
 *                                 properties:
 *                                   like:
 *                                     type: number
 *                                     example: 160
 *                                   dislike:
 *                                     type: number
 *                                     example: 5
 *                     totalPrice:
 *                       type: number
 *                       example: 1100000
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-28T08:35:32.252Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-28T08:40:50.389Z"
 *       400:
 *         description: Bad request - Invalid input data.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 400
 *               message: "Invalid product ID or quantity"
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
router.post(
  "/add",
  middleware.auth(["user", "admin"]),
  cartValidate.addToCart,
  catchAsync(controller.addToCart)
);

/**
 * @swagger
 * /cart/remove/{id}:
 *   delete:
 *     summary: Remove product from cart
 *     description: Remove a product from the user's cart by product ID. Requires authentication.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to remove from the cart.
 *         example: "67a57c2e54dd02487ee3e2fc"
 *     responses:
 *       200:
 *         description: Successfully removed product from cart.
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
 *                   example: "Cloth removed from cart"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67c17554f73ba67f6af8f82d"
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: object
 *                             properties:
 *                               _id:
 *                                 type: string
 *                                 example: "67a57c2e54dd02487ee3e2fc"
 *                               title:
 *                                 type: string
 *                                 example: "Quần short nam"
 *                               description:
 *                                 type: string
 *                                 example: "Quần short nam năng động, phù hợp mùa hè"
 *                               price:
 *                                 type: number
 *                                 example: 220000
 *                               discountPercentage:
 *                                 type: number
 *                                 example: 10
 *                               stock:
 *                                 type: number
 *                                 example: 45
 *                               status:
 *                                 type: string
 *                                 example: "inactive"
 *                               deleted:
 *                                 type: boolean
 *                                 example: false
 *                               thumbnail:
 *                                 type: string
 *                                 example: "https://example.com/quan-short-nam.jpg"
 *                               rating:
 *                                 type: object
 *                                 properties:
 *                                   like:
 *                                     type: number
 *                                     example: 160
 *                                   dislike:
 *                                     type: number
 *                                     example: 5
 *                     totalPrice:
 *                       type: number
 *                       example: 1100000
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-28T08:35:32.252Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-28T08:40:50.389Z"
 *       400:
 *         description: Bad request - Invalid product ID.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 400
 *               message: "Invalid product ID"
 *       401:
 *         description: Unauthorized - User is not authenticated.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 401
 *               message: "Unauthorized"
 *       404:
 *         description: Not found - Product does not exist in cart.
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 404
 *               message: "Product not found in cart"
 *       500:
 *         description: Internal server error.
 */
router.delete("/remove/:id", middleware.auth(["user", "admin"]), catchAsync(controller.remove));

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear user cart
 *     description: Remove all products from the user's shopping cart.
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully.
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
 *                   example: "Cart cleared successfully"
 *                 data:
 *                   type: "null"
 *                   example: null
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
router.delete("/clear", middleware.auth(["user", "admin"]), catchAsync(controller.clear));

export default router;
