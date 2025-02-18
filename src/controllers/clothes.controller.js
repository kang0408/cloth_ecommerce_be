const { default: httpStatus } = require("http-status");

const paginationHandler = require("../helpers/pagination.helper");
const sortHandler = require("../helpers/sort.helper");
const { successResponse, errorResponse } = require("../helpers/response.helper");

const Cloth = require("../models/clothes.model");

// [GET] api/v1/clothes
module.exports.clothes = async (req, res) => {
  try {
    const find = {
      deleted: false
    };

    // Sort
    const { sortBy, sortValue } = req.query;
    const sort = sortHandler(req.query);
    if (sortBy) {
      if (sortBy.toLowerCase() === "like" || sortBy.toLowerCase() === "dislike")
        sort[`rating.${sortBy.toLowerCase()}`] = sortValue === "asc" ? 1 : -1;
    }

    // Pagination
    const paginationDefault = { currentPage: 1, limitPage: 5 };
    const pageTotal = await Cloth.countDocuments();
    const paginationObject = paginationHandler(paginationDefault, pageTotal, req.query);

    const clothes = await Cloth.find(find)
      .skip(paginationObject.offset)
      .limit(paginationObject.limitPage)
      .sort(sort)
      .select("-__v");

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

    const result = data.toObject();
    delete result.__v;

    return successResponse(res, result, "Create cloth successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [PATCH] api/v1/clothes/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    // Tìm quần áo trước khi cập nhật
    const cloth = await Cloth.findById(id);
    if (!cloth) {
      return errorResponse(res, null, httpStatus.NOT_FOUND, "Cloth not found");
    }

    // Cập nhật quần áo
    const result = await Cloth.updateOne({ _id: id }, req.body);

    // Kiểm tra xem có gì thay đổi không
    if (result.modifiedCount === 0) {
      return errorResponse(res, null, httpStatus.BAD_REQUEST, "No changes applied");
    }

    const data = await Cloth.findById(id);

    return successResponse(res, data, "Edit cloth successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [DELETE] api/v1/clothes/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const id = req.params.id;
    const sortType = req.query.sortType;

    const cloth = await Cloth.findOne({
      _id: id,
      deleted: false
    });

    if (!cloth) {
      return errorResponse(res, null, httpStatus.NOT_FOUND, "Cloth not found or already deleted");
    }

    if (sortType === "soft") {
      await Cloth.updateOne(
        { _id: id },
        {
          deleted: true,
          deletedAt: new Date()
        }
      );
    } else {
      await Cloth.deleteOne({ _id: id });
    }

    return successResponse(res, null, "Delete cloth successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [GET] api/v1/clothes/details/:id
module.exports.details = async (req, res) => {
  try {
    const id = req.params.id;

    const cloth = await Cloth.findById(id);
    if (!cloth) {
      return errorResponse(res, null, httpStatus.NOT_FOUND, "Cloth not found");
    }

    return successResponse(res, cloth, "Get details cloth successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};
