const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    quantity: Number,
    status: String,
    parentId: {
      type: Array,
      default: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }]
    },
    deleted: {
      type: Boolean,
      default: false
    },
    createdAt: Date,
    deletedAt: Date,
    updatedAt: Date
  },
  {
    timestamps: true
  }
);

const Category = mongoose.model("Category", categorySchema, "categories");

module.exports = Category;
