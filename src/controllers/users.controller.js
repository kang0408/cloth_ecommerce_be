const bcrypt = require("bcrypt");
const { default: httpStatus } = require("http-status");
const mongoose = require("mongoose");

const User = require("../models/users.model");

const paginationHandler = require("../helpers/pagination.helper");
const sortHandler = require("../helpers/sort.helper");
const { successResponse, errorResponse } = require("../helpers/response.helper");
const cloudinary = require("../configs/cloudinary");

// [GET] api/v1/users
module.exports.users = async (req, res) => {
  try {
    // Sort
    const sort = sortHandler(req.query);

    // Pagination
    const paginationDefault = { currentPage: 1, limitPage: 5 };
    const pageTotal = await User.countDocuments();
    const paginationObject = paginationHandler(paginationDefault, pageTotal, req.query);

    const users = await User.find()
      .skip(paginationObject.offset)
      .limit(paginationObject.limitPage)
      .sort(sort)
      .select("-__v -password -cloudinary_id -favourites");

    return successResponse(
      res,
      {
        users,
        totalPages: paginationObject.totalPage,
        currentPage: paginationObject.currentPage
      },
      "Get all users successfully"
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [GET] api/v1/users/profile
module.exports.profileByAuth = async (req, res) => {
  try {
    const { id, role } = req.user;

    let select = "-__v -password -cloudinary_id";
    if (role === "admin") select += " -favourites";

    const data = await User.findOne({ _id: id }).select(select);

    return successResponse(res, data, "Get profile successfully");
  } catch (error) {
    return errorResponse(res, error, 500, "Get profile failure");
  }
};

// [GET] api/v1/users/profile/:id
module.exports.profileById = async (req, res) => {
  try {
    const { role } = req.user;
    const { id } = req.params;

    let select = "-__v -password -cloudinary_id";
    if (role === "admin") select += " -favourites";

    const data = await User.findOne({ _id: id }).select(select);

    return successResponse(res, data, "Get profile successfully");
  } catch (error) {
    return errorResponse(res, error, 500, "Get profile failure");
  }
};

// [POST] api/v1/users/create
module.exports.create = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (user) return errorResponse(res, null, httpStatus.BAD_REQUEST, "Email is existed");

    const defaultPassword = "Abc@12345";

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(defaultPassword, salt);

    req.body.password = hashPassword;

    let newUser;
    if (req.files && req.files.length > 0) {
      // using cloudinary.uploader.upload() to upload image in cloundinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${req.files[0].buffer.toString("base64")}`,
        {
          folder: "clothes-management/users",
          resource_type: "image"
        }
      );

      req.body.avatar = result.secure_url;
      req.body.cloudinary_id = result.public_id;
    }
    newUser = new User(req.body);

    await newUser.save();

    return successResponse(res, null, "Create user successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [PATCH] api/v1/users/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });
    if (!user) return errorResponse(res, error, httpStatus.NOT_FOUND, "User not found");

    if (user.cloudinary_id) await cloudinary.uploader.destroy(user.cloudinary_id);

    // checking avatar/files
    if (req.files && req.files.length > 0) {
      // using cloudinary.uploader.upload() to upload image in cloundinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${req.files[0].buffer.toString("base64")}`,
        {
          folder: "clothes-management/users",
          resource_type: "image"
        }
      );

      req.body.avatar = result.secure_url;
      req.body.cloudinary_id = result.public_id;
    }

    await User.updateOne({ _id: id }, req.body);

    return successResponse(res, null, "Edit user successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [PATCH] api/v1/users/update-profile
module.exports.updateProfileByAuth = async (req, res) => {
  try {
    const { id } = req.user;
    const { email } = req.body;

    const user = await User.findOne({ _id: id });
    if (!user) return errorResponse(res, error, httpStatus.NOT_FOUND, "User not found");

    const isExisted = await User.findOne({ email: email });
    if (isExisted) return errorResponse(res, null, httpStatus.BAD_REQUEST, "Email is existed");

    if (user.cloudinary_id) await cloudinary.uploader.destroy(user.cloudinary_id);

    // checking avatar/files
    if (req.files && req.files.length > 0) {
      // using cloudinary.uploader.upload() to upload image in cloundinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${req.files[0].buffer.toString("base64")}`,
        {
          folder: "clothes-management/users",
          resource_type: "image"
        }
      );

      req.body.avatar = result.secure_url;
      req.body.cloudinary_id = result.public_id;
    }

    await User.updateOne({ _id: id }, req.body);

    return successResponse(res, null, "User updated successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [DELETE] api/v1/users/delete/:id
module.exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });
    if (!user) return errorResponse(res, error, httpStatus.BAD_REQUEST, "User does not exist");

    if (user.avatar && user.cloudinary_id) await cloudinary.uploader.destroy(user.cloudinary_id);

    await User.deleteOne({ _id: id });

    return successResponse(res, null, "Delete user successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};
