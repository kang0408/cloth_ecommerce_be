const express = require("express");

const controller = require("../../controllers/categories.controller");
const cateValidate = require("../../validations/categories.valiation");
const middleware = require("../../middlewares/auth.middleware.js");

const router = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Retrieve all categories with pagination and sorting options
 *     description: Fetches a list of product categories, including parent categories and their respective subcategories. Supports pagination, sorting, and filtering.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number to retrieve.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of categories per page.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, createdAt, updatedAt]
 *           default: createdAt
 *         description: The field by which the categories should be sorted.
 *       - in: query
 *         name: sortValue
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: The sorting order (ascending or descending).
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of categories.
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
 *                   example: "Get all categories successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     cates:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "67ad951b116fbb66a27b085a"
 *                           name:
 *                             type: string
 *                             example: "Men's Fashion"
 *                           description:
 *                             type: string
 *                             example: "Category for men's clothing"
 *                           quantity:
 *                             type: integer
 *                             example: 100
 *                           image:
 *                             type: string
 *                             example: "https://example.com/images/men-fashion.jpg"
 *                           status:
 *                             type: string
 *                             enum: [active, inactive]
 *                             example: "active"
 *                           deleted:
 *                             type: boolean
 *                             example: false
 *                           parentId:
 *                             type: array
 *                             items:
 *                               type: string
 *                             example: []
 *                           createdAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-11T00:00:00Z"
 *                           updatedAt:
 *                             type: string
 *                             format: date-time
 *                             example: "2025-02-11T00:00:00Z"
 *                           subCategories:
 *                             type: array
 *                             items:
 *                               type: object
 *                               properties:
 *                                 _id:
 *                                   type: string
 *                                   example: "65c892f1a2b3c4d5e6f70115"
 *                                 name:
 *                                   type: string
 *                                   example: "Men's Shoes"
 *                                 description:
 *                                   type: string
 *                                   example: "A category for men's shoes"
 *                                 quantity:
 *                                   type: integer
 *                                   example: 40
 *                                 image:
 *                                   type: string
 *                                   example: "https://example.com/images/mens-shoes.jpg"
 *                                 status:
 *                                   type: string
 *                                   enum: [active, inactive]
 *                                   example: "inactive"
 *                                 deleted:
 *                                   type: boolean
 *                                   example: false
 *                                 parentId:
 *                                   type: array
 *                                   items:
 *                                     type: string
 *                                   example: ["65c892f1a2b3c4d5e6f70111"]
 *                                 createdAt:
 *                                   type: string
 *                                   format: date-time
 *                                   example: "2025-02-11T00:00:00Z"
 *                                 updatedAt:
 *                                   type: string
 *                                   format: date-time
 *                                   example: "2025-02-11T00:00:00Z"
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     currentPage:
 *                       type: integer
 *                       example: 1
 *       500:
 *         description: Internal server error.
 */
router.get("", controller.categories);

/**
 * @swagger
 * /categories/detail/{id}:
 *   get:
 *     summary: Get category details
 *     description: Retrieve detailed information about a specific category.
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the category to retrieve.
 *         schema:
 *           type: string
 *           example: "67ad951b116fbb66a27b085a"
 *     responses:
 *       200:
 *         description: Get category details successfully.
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
 *                   example: "Get details category successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67ad951b116fbb66a27b085a"
 *                     name:
 *                       type: string
 *                       example: "Thời trang test123"
 *                     description:
 *                       type: string
 *                       example: "Mô tả thời trang trẻ em"
 *                     quantity:
 *                       type: integer
 *                       example: 50
 *                     image:
 *                       type: string
 *                       example: "hình ảnh"
 *                     status:
 *                       type: string
 *                       enum: [active, inactive]
 *                       example: "active"
 *                     parentId:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: []
 *                     deleted:
 *                       type: boolean
 *                       example: false
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-13T06:45:47.352Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-13T10:44:23.200Z"
 *       400:
 *        description: Category not found
 *        content:
 *          application/json:
 *            example:
 *              success: false
 *              code: 400
 *              message: "Category not found"
 *       500:
 *         description: Internal server error.
 */
router.get("/details/:id", controller.details);

/**
 * @swagger
 * /categories/edit/{id}:
 *   patch:
 *     summary: Update a category by ID
 *     description: Edit an existing category by providing updated details.
 *     tags:
 *       - Categories
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the category to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Men's Fashion"
 *               description:
 *                 type: string
 *                 example: "Category for men's clothing"
 *               quantity:
 *                 type: integer
 *                 example: 100
 *               image:
 *                 type: string
 *                 example: "https://example.com/images/men-fashion.jpg"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: "active"
 *               deleted:
 *                 type: boolean
 *                 example: false
 *               parentId:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["65c892f1a2b3c4d5e6f70111"]
 *     responses:
 *       200:
 *         description: Successfully updated the category.
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
 *                   example: "Category updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67ad951b116fbb66a27b085a"
 *                     name:
 *                       type: string
 *                       example: "Men's Fashion"
 *                     description:
 *                       type: string
 *                       example: "Category for men's clothing"
 *                     quantity:
 *                       type: integer
 *                       example: 100
 *                     image:
 *                       type: string
 *                       example: "https://example.com/images/men-fashion.jpg"
 *                     status:
 *                       type: string
 *                       example: "active"
 *                     deleted:
 *                       type: boolean
 *                       example: false
 *                     parentId:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["65c892f1a2b3c4d5e6f70111"]
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-11T00:00:00Z"
 *       400:
 *         description: Invalid input data or no changes applied
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 400
 *               message: "No changes applied"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 404
 *               message: "Category not found"
 *       500:
 *         description: Internal server error.
 */
router.patch("/edit/:id", middleware.auth(["admin"]), cateValidate.editCate, controller.edit);

/**
 * @swagger
 * /categories/create:
 *   post:
 *     summary: Create a new category
 *     description: Add a new category with the provided details.
 *     tags:
 *       - Categories
 *     security:
 *       - berearAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 required: true
 *                 example: "Men's Fashion"
 *               description:
 *                 type: string
 *                 required: true
 *                 example: "Category for men's clothing"
 *               quantity:
 *                 type: integer
 *                 example: 100
 *               image:
 *                 type: string
 *                 example: "https://example.com/images/men-fashion.jpg"
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 example: "active"
 *               deleted:
 *                 type: boolean
 *                 example: false
 *               parentId:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["65c892f1a2b3c4d5e6f70111"]
 *     responses:
 *       200:
 *         description: Successfully created the category.
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
 *                   example: "Create category successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "67ad951b116fbb66a27b085a"
 *                     name:
 *                       type: string
 *                       example: "Men's Fashion"
 *                     description:
 *                       type: string
 *                       example: "Category for men's clothing"
 *                     quantity:
 *                       type: integer
 *                       example: 100
 *                     image:
 *                       type: string
 *                       example: "https://example.com/images/men-fashion.jpg"
 *                     status:
 *                       type: string
 *                       example: "active"
 *                     deleted:
 *                       type: boolean
 *                       example: false
 *                     parentId:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["65c892f1a2b3c4d5e6f70111"]
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-02-11T00:00:00Z"
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 400
 *               message: "Invalid input data"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 500
 *               message: "Internal server error"
 */
router.post("/create", middleware.auth(["admin"]), cateValidate.createCate, controller.create);

/**
 * @swagger
 * /categories/delete/{id}:
 *   delete:
 *     summary: Delete a specific category
 *     description: API for deleting a specific category item by its ID
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category item
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delete category successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Delete category successfully"
 *               data: null
 *       404:
 *         description: Category not found or already deleted
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 404
 *               message: "Category not found or already deleted"
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:id", middleware.auth(["admin"]), controller.delete);

module.exports = router;
