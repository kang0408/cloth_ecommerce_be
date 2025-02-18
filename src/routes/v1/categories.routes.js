const express = require("express");

const controller = require("../../controllers/categories.controller");
const cateValidate = require("../../validations/categories.valiation");
const middleware = require("../../middlewares/auth.middleware.js");

const router = express.Router();

router.get("", controller.categories);

router.get("/details/:id", controller.details);

router.patch("/edit/:id", middleware.auth(["admin"]), cateValidate.editCate, controller.edit);

router.post("/create", middleware.auth(["admin"]), cateValidate.createCate, controller.create);

router.delete("/delete/:id", middleware.auth(["admin"]), controller.delete);

module.exports = router;
