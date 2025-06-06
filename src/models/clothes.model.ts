import mongoose, { Document } from "mongoose";

import { ICloth } from "../types/cloth.types";

interface IClothDocument extends ICloth, Document {}

const clothSchema = new mongoose.Schema<IClothDocument>(
  {
    title: String,
    description: String,
    price: {
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

const Cloth = mongoose.model<IClothDocument>("Cloth", clothSchema, "clothes");

export default Cloth;
