import httpStatus from "http-status";

import Cart from "../models/cart.model";
import Cloth from "../models/clothes.model";

export const getCart = async (userId: string) => {
  if (!userId) {
    throw { status: httpStatus.UNAUTHORIZED, message: "Unauthorized" };
  }

  const cart = await Cart.findOne({ userId })
    .populate("items.productId", "-cloudinary_id -__v")
    .select("-__v -userId");

  if (!cart) {
    throw { status: httpStatus.NOT_FOUND, message: "Cart not found" };
  }

  return cart;
};

export const addToCart = async (userId: string, productId: string, quantity: number) => {
  if (!userId) {
    throw { status: httpStatus.UNAUTHORIZED, message: "Unauthorized" };
  }

  const cloth = await Cloth.findById(productId);
  if (!cloth) {
    throw { status: httpStatus.BAD_REQUEST, message: "Cloth not found" };
  }

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({
      userId,
      items: [{ productId, quantity, price: cloth.price }],
      totalPrice: quantity * (cloth.price ?? 0)
    });
  } else {
    const existCloth = cart.items.find((item) => item.productId == productId);
    if (existCloth) {
      existCloth.quantity += Number(quantity);
    } else {
      cart.items.push({ productId, quantity, price: cloth.price ?? 0 });
    }

    cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);
  }

  await cart.save();

  return await Cart.findOne({ userId })
    .populate("items.productId", "-cloudinary_id -__v")
    .select("-__v -userId");
};

export const removeFromCart = async (userId: string, productId: string) => {
  if (!userId) {
    throw { status: httpStatus.UNAUTHORIZED, message: "Unauthorized" };
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw { status: httpStatus.NOT_FOUND, message: "Cart not found" };
  }

  cart.items = cart.items.filter((item) => !(item.productId == productId));
  cart.totalPrice = cart.items.reduce((total, item) => total + item.quantity * item.price, 0);

  await cart.save();

  return await Cart.findOne({ userId })
    .populate("items.productId", "-cloudinary_id -__v")
    .select("-__v -userId");
};

export const clearCart = async (userId: string) => {
  if (!userId) {
    throw { status: httpStatus.UNAUTHORIZED, message: "Unauthorized" };
  }

  await Cart.deleteOne({ userId });
};
