import { Request, Response } from "express";

import * as cartService from "../services/cart.services";
import { successResponse, errorResponse } from "../helpers/response.helper";

// [GET] api/v1/cart
export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    const cart = await cartService.getCart(userId);
    successResponse(res, cart, "Get cart successfully");
  } catch (error: any) {
    errorResponse(res, null, error.status || 500, error.message || "Get cart failed");
  }
};

// [POST] api/v1/cart/add
export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    const { productId, quantity } = req.body;
    const cart = await cartService.addToCart(userId, productId, quantity);
    successResponse(res, cart, "Cloth added to cart");
  } catch (error: any) {
    errorResponse(res, null, error.status || 500, error.message || "Add to cart failed");
  }
};

// [DELETE] api/v1/cart/remove/:id
export const remove = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    const productId = req.params.id;
    const cart = await cartService.removeFromCart(userId, productId);
    successResponse(res, cart, "Cloth removed from cart");
  } catch (error: any) {
    errorResponse(res, null, error.status || 500, error.message || "Remove from cart failed");
  }
};

// [DELETE] api/v1/cart/clear
export const clear = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any)?.id;
    await cartService.clearCart(userId);
    successResponse(res, null, "Cart cleared successfully");
  } catch (error: any) {
    errorResponse(res, null, error.status || 500, error.message || "Clear cart failed");
  }
};
