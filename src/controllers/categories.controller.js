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
