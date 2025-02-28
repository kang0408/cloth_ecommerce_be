const { default: httpStatus } = require("http-status");
const mongoose = require("mongoose");

const { successResponse, errorResponse } = require("../helpers/response.helper");

const Cart = require("../models/cart.model");
const Cloth = require("../models/clothes.model");

// [GET] api/v1/cart
module.exports.getCart = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const cart = await Cart.findOne({ userId })
      .populate("items.productId", "-cloudinary_id -__v")
      .select("-__v -userId");
    if (!cart) return errorResponse(res, null, httpStatus.NOT_FOUND, "Cart not found");

    return successResponse(res, cart, "Get cart successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [POST] api/v1/cart/add
module.exports.addToCart = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { productId, quantity } = req.body;

    const cloth = await Cloth.findById(productId);
    if (!cloth) return errorResponse(res, null, httpStatus.BAD_REQUEST, "Cloth not found");

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, price: cloth.price }],
        totalPrice: quantity * cloth.price
      });
    } else {
      const existCloth = cart.items.find((item) => item.productId.equals(productId));

      if (existCloth) {
        existCloth.quantity += Number(quantity);
      } else {
        cart.items.push({ productId, quantity, price: cloth.price });
      }

      cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
    }

    await cart.save();

    return successResponse(res, null, "Cloth added to cart");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [DELETE] api/v1/cart/remove/:id
module.exports.remove = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const productId = req.params.id;

    const cart = await Cart.findOne({ userId });
    if (!cart) return errorResponse(res, null, httpStatus.NOT_FOUND, "Cart not found");

    const result = cart.items.filter((item) => {
      return !item.productId.equals(productId);
    });
    cart.items = result;

    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

    await Cart.updateOne({ userId }, cart);
    return successResponse(res, null, "Cloth removed from cart");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [DELETE] api/v1/cart/clear
module.exports.clear = async (req, res) => {
  try {
    const { id: userId } = req.user;
    await Cart.deleteOne({ userId });

    return successResponse(res, null, "Cart cleared successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};
