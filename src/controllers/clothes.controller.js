const { default: httpStatus } = require("http-status");

const paginationHandler = require("../helpers/pagination.helper");
const { successResponse, errorResponse } = require("../helpers/response.helper");

const Cloth = require("../models/clothes.model");

// [GET] api/v1/clothes
module.exports.clothes = async (req, res) => {
  try {
    const { sortBy, sortValue } = req.query;

    const find = {
      deleted: false
    };

    // Sort
    const sort = {};
    if (sortBy) {
      if (sortBy.toLowerCase() === "like" || sortBy.toLowerCase() === "dislike")
        sort[`rating.${sortBy.toLowerCase()}`] = sortValue === "asc" ? 1 : -1;
      sort[sortBy] = sortValue === "asc" ? 1 : -1;
    }

    // Pagination
    const paginationDefault = { currentPage: 1, limitPage: 5 };
    const pageTotal = await Cloth.countDocuments();
    const paginationObject = paginationHandler(paginationDefault, pageTotal, req.query);
    console.log(paginationObject);

    const clothes = await Cloth.find(find)
      .skip(paginationObject.offset)
      .limit(paginationObject.limitPage)
      .sort(sort);

    return successResponse(
      res,
      {
        clothes,
        totalPages: paginationObject.totalPage,
        currentPage: paginationObject.currentPage
      },
      "Get all clothes successfully"
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};
