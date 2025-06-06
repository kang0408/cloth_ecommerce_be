import mongoose, { Document } from "mongoose";

import { ICart } from "../types/cart.types";

interface ICartDocument extends ICart, Document {}

const cartSchema = new mongoose.Schema<ICartDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Cloth" },
        quantity: { type: Number, default: 1, min: 1 },
        price: { type: Number, required: true }
      }
    ],
    totalPrice: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

const Cart = mongoose.model<ICartDocument>("Cart", cartSchema, "cart");

export default Cart;
