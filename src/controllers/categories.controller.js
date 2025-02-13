const mongoose = require("mongoose");

const paginationHandler = require("../helpers/pagination.helper");
const sortHandler = require("../helpers/sort.helper");
const { successResponse, errorResponse } = require("../helpers/response.helper");

const Category = require("../models/category.model");

// [GET] api/v1/categories
module.exports.categories = async (req, res) => {
  try {
    const { filter } = req.query;

    // Sort
    const sort = sortHandler(req.query);

    // Pagination
    const paginationDefault = { currentPage: 1, limitPage: 5 };
    const pageTotal = await Category.countDocuments({ parentId: { $size: 0 } });
    const paginationObject = paginationHandler(paginationDefault, pageTotal, req.query);

    const cates = await Category.aggregate([
      {
        $lookup: {
          from: "categories", // Find in what document?
          localField: "_id", // Main key?
          foreignField: "parentId", // Foreign key?
          as: "subCategories" // Where it save?
        }
      },
      {
        $match: {
          parentId: { $size: 0 }, // Filter parent
          deleted: false,
          ...(filter
            ? { name: { $regex: filter, $options: "i" } } // Nếu có filter → thêm điều kiện lọc
            : {}) // Nếu không có filter → không thêm gì cả (object rỗng)
        }
      },
      ...(Object.keys(sort).length > 0 ? [{ $sort: sort }] : [{ $sort: { createdAt: -1 } }]),
      {
        $skip: paginationObject.offset
      },
      {
        $limit: paginationObject.limitPage
      }
    ]);

    return successResponse(
      res,
      {
        cates,
        totalPages: paginationObject.totalPage,
        currentPage: paginationObject.currentPage
      },
      "Get all categories successfully"
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [GET] api/v1/categories/details/:id
module.exports.details = async (req, res) => {
  try {
    const id = req.params.id;

    const cate = await Category.findOne({ _id: id, deleted: false });
    if (!cate) {
      return errorResponse(res, null, 404, "Category not found");
    }

    return successResponse(res, cate, "Get details cloth successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [POST] api/v1/categories/create
module.exports.create = async (req, res) => {
  try {
    const { parentId } = req.body;
    const objectIdArr = parentId.map((id) => new mongoose.Types.ObjectId(id));

    req.body.parentId = objectIdArr;
    req.body.createdAt = new Date();

    const newCate = await Category(req.body);
    const result = await newCate.save();

    const data = result.toObject();
    delete data.__v;

    return successResponse(res, data, "Create cloth successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [DELETE] api/v1/categories/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const sortType = req.query.sortType;

    const cate = await Category.findOne({
      _id: id,
      deleted: false
    });

    if (!cate) {
      return errorResponse(res, null, 404, "Category not found or already deleted");
    }

    if (sortType === "sort") {
      await Category.updateOne(
        {
          _id: id
        },
        {
          deleted: true,
          deletedAt: new Date()
        }
      );
    } else {
      await Category.deleteOne({ _id: id });
    }

    return successResponse(res, null, "Delete category successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};
