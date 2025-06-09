import { Types } from "mongoose";

export interface ICartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface ICart {
  userId: Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
}
