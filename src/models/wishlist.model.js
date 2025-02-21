const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
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

const Wishlist = mongoose.model("Wishlist", wishlistSchema, "wishlists");

module.exports = Wishlist;
