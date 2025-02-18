const express = require("express");

const controller = require("../../controllers/clothes.controller");
const clothValidate = require("../../validations/clothes.validation");
const middleware = require("../../middlewares/auth.middleware.js");

const router = express.Router();

router.get("", controller.clothes);

router.get("/details/:id", controller.details);

router.post("/create", middleware.auth(["admin"]), clothValidate.createCloth, controller.create);

router.patch("/edit/:id", middleware.auth(["admin"]), clothValidate.editCloth, controller.edit);

router.delete("/delete/:id", middleware.auth(["admin"]), controller.delete);

module.exports = router;
