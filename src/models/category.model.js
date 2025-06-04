const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    status: String,
    parentId: {
      type: Array,
      default: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }]
    }
  },
  {
    timestamps: true
  }
);

const Category = mongoose.model("Category", categorySchema, "categories");

module.exports = Category;
