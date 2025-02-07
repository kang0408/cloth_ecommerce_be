const express = require("express");
const controller = require("../../controllers/clothes.controller");

const router = express.Router();

router.get("", controller.clothes);

module.exports = router;
