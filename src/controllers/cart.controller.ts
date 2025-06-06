import httpStatus from "http-status";
import { Request, Response } from "express";

import { successResponse, errorResponse } from "../helpers/response.helper";

import Cart from "../models/cart.model";
import Cloth from "../models/clothes.model";

// [GET] api/v1/cart
export const getCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id: userId } = req.user;
    const cart = await Cart.findOne({ userId })
      .populate("items.productId", "-cloudinary_id -__v")
      .select("-__v -userId");
    if (!cart) {
      errorResponse(res, null, httpStatus.NOT_FOUND, "Cart not found");
      return;
    }

    successResponse(res, cart, "Get cart successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [POST] api/v1/cart/add
export const addToCart = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id: userId } = req.user;
    const { productId, quantity } = req.body;

    const cloth = await Cloth.findById(productId);
    if (!cloth) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "Cloth not found");
      return;
    }

    let cart = await Cart.findOne({ userId })
      .populate("items.productId", "-cloudinary_id -__v")
      .select("-__v -userId");
    if (!cart) {
      cart = new Cart({
        userId,
        items: [{ productId, quantity, price: cloth.price }],
        totalPrice: quantity * (cloth.price ?? 0)
      });
    } else {
      const existCloth = cart.items.find((item) => item.productId.equals(productId));

      if (existCloth) {
        existCloth.quantity += Number(quantity);
      } else {
        cart.items.push({ productId, quantity, price: cloth.price ?? 0 });
      }

      cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
    }

    await cart.save();

    successResponse(res, cart, "Cloth added to cart");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [DELETE] api/v1/cart/remove/:id
export const remove = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id: userId } = req.user;
    const productId = req.params.id;

    const cart = await Cart.findOne({ userId })
      .populate("items.productId", "-cloudinary_id -__v")
      .select("-__v -userId");
    if (!cart) {
      errorResponse(res, null, httpStatus.NOT_FOUND, "Cart not found");
      return;
    }

    const result = cart.items.filter((item) => {
      !item.productId.equals(productId);
      return;
    });
    cart.items = result;

    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

    await Cart.updateOne({ userId }, cart);
    successResponse(res, cart, "Cloth removed from cart");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [DELETE] api/v1/cart/clear
export const clear = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id: userId } = req.user;
    await Cart.deleteOne({ userId });

    successResponse(res, null, "Cart cleared successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};
