const paginationHandler = require("../helpers/pagination.helper");
const dataResponseFormat = require("../helpers/dataResponseFormat.helper");
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

    const clothes = await Cloth.find(find)
      .skip(paginationObject.offset)
      .limit(paginationObject.limitPage)
      .sort(sort)
      .select("-_id -__v");

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

// [POST] api/v1/clothes/create
module.exports.create = async (req, res) => {
  try {
    req.body.createdAt = new Date();
    const newCloth = new Cloth(req.body);
    const data = await newCloth.save();

    const result = dataResponseFormat(data);

    return successResponse(res, result, "Create cloth successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};
