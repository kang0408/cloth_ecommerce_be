import mongoose from "mongoose";
import Wishlist from "../models/wishlist.model";

export const findWishlistByUserId = async (userId: string) => {
  return await Wishlist.findOne({ userId })
    .populate("wishlist", "-__v")
    .select("-__v -userId")
    .exec();
};

export const createWishlistForUser = async (userId: string) => {
  const objId = new mongoose.Types.ObjectId(userId);
  const newWishlist = new Wishlist({
    userId: objId,
    wishlist: []
  });
  await newWishlist.save();
  return newWishlist;
};

export const addProductToWishlist = async (userId: string, productId: string) => {
  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = await createWishlistForUser(userId);
  }
  const prodObjId = new mongoose.Types.ObjectId(productId);

  if (wishlist.wishlist.includes(prodObjId)) {
    throw new Error("Product already in wishlist");
  }

  wishlist.wishlist.push(prodObjId);
  await Wishlist.updateOne({ _id: wishlist.id }, { wishlist: wishlist.wishlist });
  return wishlist;
};

export const removeProductFromWishlist = async (userId: string, productId: string) => {
  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) throw new Error("Wishlists not found");

  const prodObjId = new mongoose.Types.ObjectId(productId);
  if (!wishlist.wishlist.includes(prodObjId)) {
    throw new Error("Product not found in wishlist");
  }

  wishlist.wishlist = wishlist.wishlist.filter((item) => !item.equals(prodObjId));
  await wishlist.save();
  return wishlist;
};

export const clearWishlistByUserId = async (userId: string) => {
  await Wishlist.deleteOne({ userId });
};
