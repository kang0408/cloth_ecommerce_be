import mongoose, { Document } from "mongoose";

import { ICategory } from "../types/category.types";

interface ICategoruDocument extends ICategory, Document {}

const categorySchema = new mongoose.Schema<ICategoruDocument>(
  {
    name: String,
    description: String,
    status: String,
    parentId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }]
  },
  {
    timestamps: true
  }
);

const Category = mongoose.model<ICategoruDocument>("Category", categorySchema, "categories");

export default Category;
