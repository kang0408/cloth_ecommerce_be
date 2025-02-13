const express = require("express");

const controller = require("../../controllers/categories.controller");

const router = express.Router();

router.get("", controller.categories);

router.get("/details/:id", controller.details);

router.delete("/delete/:id", controller.delete);

module.exports = router;
