const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
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

const Cart = mongoose.model("Cart", cartSchema, "cart");

module.exports = Cart;
