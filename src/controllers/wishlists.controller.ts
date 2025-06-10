import httpStatus from "http-status";
import { Request, Response } from "express";

import {
  findWishlistByUserId,
  addProductToWishlist,
  removeProductFromWishlist,
  clearWishlistByUserId
} from "../services/wishlists.services";

import { successResponse, errorResponse } from "../helpers/response.helper";
import { IUserJWT } from "../types/user.types";

export const getAll = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id: userId } = req.user as IUserJWT;

    const list = await findWishlistByUserId(userId);

    if (!list) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "Wishlists not found");
      return;
    }

    successResponse(res, list, "Get wishlist successfully");
  } catch (error) {
    errorResponse(res, error);
  }
};

export const add = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id: userId } = req.user as IUserJWT;
    const productId = req.params.id;

    await addProductToWishlist(userId, productId);

    successResponse(res, httpStatus.OK, "Add wishlist successfully");
  } catch (error: any) {
    if (error.message === "Product already in wishlist") {
      errorResponse(res, null, httpStatus.BAD_REQUEST, error.message);
      return;
    }
    errorResponse(res, error);
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const productId = req.params.id;
    const { id: userId } = req.user as IUserJWT;

    await removeProductFromWishlist(userId, productId);

    successResponse(res, httpStatus.OK, "Remove wishlist successfully");
  } catch (error: any) {
    if (
      error.message === "Wishlists not found" ||
      error.message === "Product not found in wishlist"
    ) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, error.message);
      return;
    }
    errorResponse(res, error);
  }
};

export const clear = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id: userId } = req.user as IUserJWT;

    await clearWishlistByUserId(userId);

    successResponse(res, httpStatus.OK, "Clear wishlist successfully");
  } catch (error) {
    errorResponse(res, error);
  }
};
