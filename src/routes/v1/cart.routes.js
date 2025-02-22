const express = require("express");

const controller = require("../../controllers/cart.controller");
const cartValidate = require("../../validations/cart.validation");
const middleware = require("../../middlewares/auth.middleware");

const router = express.Router();

router.get("", middleware.auth(["user", "admin"]), controller.getCart);

router.post(
  "/add",
  middleware.auth(["user", "admin"]),
  cartValidate.addToCart,
  controller.addToCart
);

router.delete("/remove/:id", middleware.auth(["user", "admin"]), controller.remove);

router.delete("/clear", middleware.auth(["user", "admin"]), controller.clear);

module.exports = router;
