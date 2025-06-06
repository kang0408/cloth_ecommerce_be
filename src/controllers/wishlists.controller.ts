import mongoose, { Types } from "mongoose";
import httpStatus from "http-status";
import { Request, Response } from "express";

import Wishlist from "../models/wishlist.model";

import { successResponse, errorResponse } from "../helpers/response.helper";

// [GET] api/v1/wishlists
export const getAll = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id: userId } = req.user;
    const list = await Wishlist.findOne({ userId: userId })
      .populate("wishlist", "-__v")
      .select("-__v -userId")
      .exec();

    if (!list) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "Wishlists not found");
      return;
    }

    successResponse(res, list, "Get wishlist successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [POST] api/v1/wishlists/add/:id
export const add = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id: userId } = req.user;
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      const objId = new mongoose.Types.ObjectId(userId);
      const newWishlist = new Wishlist({
        userId: objId,
        wishlist: []
      });

      await newWishlist.save();
    }

    const id = req.params.id;
    const list = await Wishlist.findOne({ userId: userId });

    if (!list) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "Wishlists not found");
      return;
    }

    if (list.wishlist.includes(new mongoose.Types.ObjectId(id))) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "Product already in wishlist");
      return;
    }

    list.wishlist.push(new mongoose.Types.ObjectId(id));

    await Wishlist.updateOne({ _id: list.id }, { wishlist: list.wishlist });

    successResponse(res, httpStatus.OK, "Add wishlist successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [DELETE] api/v1/wishlists/remove/:id
export const remove = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const id = req.params.id;
    const { id: userId } = req.user;
    const list = await Wishlist.findOne({ userId: userId });

    if (!list) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "Wishlists not found");
      return;
    }

    if (!list.wishlist.includes(new mongoose.Types.ObjectId(id))) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "Product not found in wishlist");
      return;
    }

    list.wishlist = list.wishlist.filter((item) => !item.equals(new mongoose.Types.ObjectId(id)));

    await list.save();
    successResponse(res, httpStatus.OK, "Remove wishlist successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [DELETE] api/v1/wishlists/clear
export const clear = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id: userId } = req.user;
    const list = await Wishlist.findOne({ userId: userId });

    if (!list) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "Wishlists not found");
      return;
    }

    await Wishlist.deleteOne({ userId });

    successResponse(res, httpStatus.OK, "Clear wishlist successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};
