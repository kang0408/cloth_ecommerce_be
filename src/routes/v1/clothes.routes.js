const express = require("express");

const controller = require("../../controllers/clothes.controller");

const clothValidate = require("../../validations/clothes.validation");

const router = express.Router();

router.get("", controller.clothes);

router.post("/create", clothValidate.createCloth, controller.create);

module.exports = router;
