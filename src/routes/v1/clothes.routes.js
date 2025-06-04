const express = require("express");

const controller = require("../../controllers/clothes.controller");
const clothValidate = require("../../validations/clothes.validation");
const middleware = require("../../middlewares/auth.middleware.js");
const imageUpload = require("../../middlewares/upload/imageUpload.middleware.js");

const router = express.Router();

/**
 * @swagger
 * /clothes:
 *   get:
 *     summary: Get all clothes
 *     description: API for getting all clothes
 *     tags:
 *       - Clothes
 *     parameters:
 *       - in: query
 *         name: limit
 *         description: Limit number of clothes per page (pagination)
 *         schema:
 *           type: integer
 *       - in: query
 *         name: page
 *         description: Page number to retrieve
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         description: Field to sort by
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortValue
 *         description: Sort direction (ascending or descending)
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *       - in: query
 *         name: search
 *         description: Keyword to search clothes
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Get all clothes successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Get all clothes successfully
 *               data:
 *                 clothes:
 *                   - _id: "67a57c2e54dd02487ee3e2f3"
 *                     title: "Quần áo thể thao nam"
 *                     description: "Mô tả quần áo thể thao nam"
 *                     thumbnail: "https://res.cloudinary.com/example.jpg"
 *                     status: "active"
 *                     deleted: false
 *                     categories: []
 *                     createdAt: "2025-02-10T08:00:57.450Z"
 *                     updatedAt: "2025-02-23T08:40:04.116Z"
 *                     stock: 100
 *                     price: 150000
 *                 totalClothes: 15
 *                 totalPages: 6
 *                 currentPage: 1
 *       500:
 *         description: Internal server error
 */
router.get("", controller.clothes);

/**
 * @swagger
 * /clothes/details/{id}:
 *   get:
 *     summary: Get details of a specific cloth
 *     description: API for retrieving details of a specific cloth item by its ID
 *     tags:
 *       - Clothes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cloth item
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Get details cloth successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Get details cloth successfully"
 *               data:
 *                 stock: 0
 *                 _id: "67bae0da7dcd1efcb2926534"
 *                 title: "Quân áo mới 22"
 *                 description: "Mô tả quần áo"
 *                 thumbnail: "https://res.cloudinary.com/dt8cirdvr/image/upload/v1740300502/clothes-management/uxlmlbwprjdoacxznwjf.jpg"
 *                 status: "active"
 *                 deleted: false
 *                 categories:
 *                   - _id: "65c892f1a2b3c4d5e6f70111"
 *                     name: "Thời trang nam"
 *                   - _id: "65c892f1a2b3c4d5e6f70113"
 *                     name: "Áo nam"
 *                 createdAt: "2025-02-23T08:48:21.433Z"
 *                 updatedAt: "2025-02-23T08:48:21.433Z"
 *                 __v: 0
 *       404:
 *         description: Cloth not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 404
 *               message: "Cloth not found"
 *       500:
 *         description: Internal server error
 */
router.get("/details/:id", controller.details);

/**
 * @swagger
 * /clothes/cate/{id}:
 *   get:
 *     summary: Get clothes by category
 *     description: API for retrieving a paginated list of clothes by category ID with sorting options.
 *     tags:
 *       - Clothes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the category
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         description: Number of items per page
 *         schema:
 *           type: integer
 *           example: 5
 *       - in: query
 *         name: page
 *         required: false
 *         description: Page number
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: sortBy
 *         required: false
 *         description: Field to sort by (e.g., price, createdAt)
 *         schema:
 *           type: string
 *           example: price
 *       - in: query
 *         name: sortValue
 *         description: Sort in descending or ascending order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of clothes
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Get clothes by category successfully"
 *               data:
 *                 clothes:
 *                   - _id: "67a57c2e54dd02487ee3e2f3"
 *                     title: "Quần áo thể thao nam"
 *                     description: "Mô tả quần áo thể thao nam"
 *                     price: 150000
 *                     discountPercentage: 30
 *                     stock: 100
 *                     status: "active"
 *                     thumbnail: "https://res.cloudinary.com/dt8cirdvr/image/upload/v1740300000/clothes-management/lgfr8hqr315hlz30xyiq.png"
 *                     rating:
 *                       like: 120
 *                       dislike: 5
 *                     categories:
 *                       - "65c892f1a2b3c4d5e6f70111"
 *                       - "65c892f1a2b3c4d5e6f70113"
 *                   - _id: "67b4492a563d3c48c678e042"
 *                     title: "Quần áo mới 16"
 *                     description: "Mô tả quần áo 16"
 *                     price: 2000
 *                     discountPercentage: 15
 *                     stock: 0
 *                     status: "active"
 *                     thumbnail: "thumbnail"
 *                     categories:
 *                       - "65c892f1a2b3c4d5e6f70111"
 *                 totalPages: 2
 *                 currentPage: 1
 *       404:
 *         description: Category not found or no clothes available
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 404
 *               message: "No clothes found for this category"
 *       500:
 *         description: Internal server error
 */
router.get("/cate/:id", controller.clothesByCate);

/**
 * @swagger
 * /clothes/create:
 *   post:
 *     summary: Create a new cloth
 *     description: API for creating a new cloth item
 *     tags:
 *       - Clothes
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: Name of the cloth
 *               description:
 *                 type: string
 *                 description: Description of the cloth
 *               price:
 *                 type: number
 *                 description: Price of the cloth
 *               stock:
 *                 type: number
 *                 default: 0
 *                 description: Number of items in stock
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Image file of the cloth
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 default: active
 *                 description: Status of the cloth
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: ObjectId
 *                 description: Array of category IDs
 *     responses:
 *       201:
 *         description: Cloth created successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Cloth created successfully"
 *               data:
 *                 _id: "67bae0da7dcd1efcb2926534"
 *                 title: "Quân áo mới 22"
 *                 description: "Mô tả quần áo"
 *                 price: 150000
 *                 stock: 50
 *                 thumbnail: "https://res.cloudinary.com/image/upload/clothes.jpg"
 *                 status: "active"
 *                 categories:
 *                   - _id: "65c892f1a2b3c4d5e6f70111"
 *                     name: "Thời trang nam"
 *       400:
 *         description: Bad request (invalid input)
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 400
 *               message: "Invalid input data"
 *       500:
 *         description: Internal server error
 */
router.post(
  "/create",
  middleware.auth(["admin"]),
  imageUpload,
  clothValidate.createCloth,
  controller.create
);

/**
 * @swagger
 * /clothes/edit/{id}:
 *   patch:
 *     summary: Edit a cloth
 *     description: API for editing an existing cloth item
 *     tags:
 *       - Clothes
 *     security:
 *       - bearerAuth: []
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cloth to edit
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Name of the cloth
 *               description:
 *                 type: string
 *                 description: Description of the cloth
 *               price:
 *                 type: number
 *                 description: Price of the cloth
 *               stock:
 *                 type: number
 *                 description: Number of items in stock
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *                 description: Image file of the cloth
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 description: Status of the cloth
 *               categories:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: ObjectId
 *                 description: Array of category IDs
 *     responses:
 *       200:
 *         description: Cloth updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Cloth updated successfully"
 *               data:
 *                 _id: "67bae0da7dcd1efcb2926534"
 *                 title: "Quân áo mới 22"
 *                 description: "Mô tả quần áo"
 *                 price: 150000
 *                 stock: 50
 *                 thumbnail: "https://res.cloudinary.com/image/upload/clothes.jpg"
 *                 status: "active"
 *                 categories:
 *                   - _id: "65c892f1a2b3c4d5e6f70111"
 *                     name: "Thời trang nam"
 *       400:
 *         description: Bad request (invalid input)
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 400
 *               message: "Invalid input data"
 *       404:
 *         description: Cloth not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 404
 *               message: "Cloth not found"
 *       500:
 *         description: Internal server error
 */
router.patch(
  "/edit/:id",
  middleware.auth(["admin"]),
  imageUpload,
  clothValidate.editCloth,
  controller.edit
);

/**
 * @swagger
 * /clothes/delete/{id}:
 *   delete:
 *     summary: Delete a specific cloth
 *     description: API for deleting a specific cloth item by its ID
 *     tags:
 *       - Clothes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the cloth item
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Delete cloth successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Delete cloth successfully"
 *               data: null
 *       404:
 *         description: Cloth not found or already deleted
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               code: 404
 *               message: "Cloth not found or already deleted"
 *       500:
 *         description: Internal server error
 */
router.delete("/delete/:id", middleware.auth(["admin"]), controller.delete);

module.exports = router;
