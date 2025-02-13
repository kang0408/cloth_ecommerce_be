const express = require("express");

const controller = require("../../controllers/categories.controller");
const cateValidate = require("../../validations/categories.valiation");

const router = express.Router();

router.get("", controller.categories);

router.get("/details/:id", controller.details);

router.patch("/edit/:id", cateValidate.editCate, controller.edit);

router.post("/create", cateValidate.createCate, controller.create);

router.delete("/delete/:id", controller.delete);

module.exports = router;
