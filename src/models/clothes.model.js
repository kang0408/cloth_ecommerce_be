const mongoose = require("mongoose");

const clothSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    price: {
      type: Number,
      min: 0,
      default: 0
    },
    discountPercentage: {
      type: Number,
      min: 0,
      default: 0
    },
    stock: {
      type: Number,
      min: 0,
      default: 0
    },
    thumbnail: String,
    cloudinary_id: String,
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }]
  },
  {
    timestamps: true
  }
);

const Cloth = mongoose.model("Cloth", clothSchema, "clothes");

module.exports = Cloth;
