const express = require("express");

const controller = require("../../controllers/users.controller");
const userValidate = require("../../validations/users.validation.js");

const middleware = require("../../middlewares/auth.middleware.js");

const router = express.Router();

router.get("", controller.users);

router.get("/profile", middleware.auth, controller.profile);

router.post("/create", userValidate.create, controller.create);

router.post("/edit/:id", userValidate.edit, controller.edit);

router.delete("/delete/:id", controller.delete);

module.exports = router;
