const express = require("express");

const controller = require("../../controllers/users.controller");

const middleware = require("../../middlewares/auth.middleware.js");

const router = express.Router();

router.get("/profile", middleware.auth, controller.profile);

module.exports = router;
