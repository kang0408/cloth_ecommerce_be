import { Types } from "mongoose";

export interface IWishlist {
  userId: Types.ObjectId;
  wishlist: Types.ObjectId[];
}
