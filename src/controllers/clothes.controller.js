const mongoose = require("mongoose");
const { default: httpStatus } = require("http-status");

const paginationHandler = require("../helpers/pagination.helper");
const sortHandler = require("../helpers/sort.helper");
const { successResponse, errorResponse } = require("../helpers/response.helper");
const cloudinary = require("../configs/cloudinary");

const Cloth = require("../models/clothes.model");
const Cate = require("../models/category.model");

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
      .populate("categories", "_id name")
      .skip(paginationObject.offset)
      .limit(paginationObject.limitPage)
      .sort(sort)
      .select("-__v -cloudinary_id");

    return successResponse(
      res,
      {
        clothes,
        totalClothes: pageTotal,
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
    if (req.body.categories) {
      const categories = req.body.categories.split(",");
      const objectIdArr = categories.map((id) => new mongoose.Types.ObjectId(id.trim()));

      req.body.categories = objectIdArr;
    }
    req.body.createdAt = new Date();

    let newCloth;
    // checking avatar/files
    if (req.files && req.files.length > 0) {
      // using cloudinary.uploader.upload() to upload image in cloundinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${req.files[0].buffer.toString("base64")}`,
        {
          folder: "clothes-management/clothes",
          resource_type: "image"
        }
      );

      req.body.thumbnail = result.secure_url;
      req.body.cloudinary_id = result.public_id;
    }

    newCloth = new Cloth(req.body);

    const data = await newCloth.save();

    const result = data.toObject();
    delete result.__v;
    delete result.cloudinary_id;

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

    if (req.body.categories) {
      const categories = req.body.categories.split(",");
      const objectIdArr = categories.map((id) => new mongoose.Types.ObjectId(id.trim()));

      req.body.categories = objectIdArr;
    }

    if (cloth.cloudinary_id) await cloudinary.uploader.destroy(cloth.cloudinary_id);

    // checking avatar/files
    if (req.files && req.files.length > 0) {
      // using cloudinary.uploader.upload() to upload image in cloundinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${req.files[0].buffer.toString("base64")}`,
        {
          folder: "clothes-management/clothes",
          resource_type: "image"
        }
      );
      req.body.thumbnail = result.secure_url;
      req.body.cloudinary_id = result.public_id;
    }

    // Cập nhật quần áo
    const result = await Cloth.updateOne({ _id: id }, req.body);

    // Kiểm tra xem có gì thay đổi không
    if (result.modifiedCount === 0) {
      return errorResponse(res, null, httpStatus.BAD_REQUEST, "No changes applied");
    }

    const data = await Cloth.findById(id).select("-__v -cloudinary_id");

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
      if (cloth.thumbnail && cloth.cloudinary_id)
        await cloudinary.uploader.destroy(cloth.cloudinary_id);
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

    const cloth = await Cloth.findById(id)
      .populate("categories", "_id name")
      .select("-cloudinary_id");
    if (!cloth) {
      return errorResponse(res, null, httpStatus.NOT_FOUND, "Cloth not found");
    }

    return successResponse(res, cloth, "Get details cloth successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [GET] api/v1/clothes/cate/:id
module.exports.clothesByCate = async (req, res) => {
  try {
    const { id } = req.params;

    // Sort
    const { sortBy, sortValue } = req.query;
    const sort = sortHandler(req.query);
    if (sortBy) {
      if (sortBy.toLowerCase() === "like" || sortBy.toLowerCase() === "dislike")
        sort[`rating.${sortBy.toLowerCase()}`] = sortValue === "asc" ? 1 : -1;
    }

    // Pagination
    const paginationDefault = { currentPage: 1, limitPage: 5 };
    const pageTotal = await Cloth.countDocuments({
      categories: { $in: { _id: id } }
    });
    const paginationObject = paginationHandler(paginationDefault, pageTotal, req.query);

    const cate = await Cate.findOne({ _id: id });
    if (!cate) return errorResponse(res, null, httpStatus.NOT_FOUND, "Category not found");

    const clothes = await Cloth.find({ categories: { $in: [new mongoose.Types.ObjectId(id)] } })
      .skip(paginationObject.offset)
      .limit(paginationObject.limitPage)
      .sort(sort)
      .select("-__v -cloudinary_id");

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
