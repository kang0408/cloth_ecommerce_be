const express = require("express");

const controller = require("../../controllers/wishlists.controller");
const middleware = require("../../middlewares/auth.middleware.js");

const router = express.Router();

router.get("", middleware.auth(["user", "admin"]), controller.getAll);

router.post("/add/:id", middleware.auth(["user", "admin"]), controller.add);

module.exports = router;
