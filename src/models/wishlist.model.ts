import mongoose, { Document } from "mongoose";

import { IWishlist } from "../types/wishlist.types";

interface IWishlistDocument extends IWishlist, Document {}

const wishlistSchema = new mongoose.Schema<IWishlistDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Cloth" }]
  },
  {
    timestamps: true
  }
);

const Wishlist = mongoose.model<IWishlistDocument>("Wishlist", wishlistSchema, "wishlists");

export default Wishlist;
