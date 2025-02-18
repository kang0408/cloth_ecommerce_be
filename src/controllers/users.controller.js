const bcrypt = require("bcrypt");
const { default: httpStatus } = require("http-status");

const User = require("../models/users.model");

const paginationHandler = require("../helpers/pagination.helper");
const sortHandler = require("../helpers/sort.helper");
const { successResponse, errorResponse } = require("../helpers/response.helper");

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
      .select("-__v -password");

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
module.exports.profile = async (req, res) => {
  try {
    const { id, role } = req.user;

    let select = "-__v -password";
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
    if (user) return errorResponse(res, error, httpStatus.BAD_REQUEST, "Email is existed");

    const defaultPassword = "Abc@12345";

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(defaultPassword, salt);

    req.body.password = hashPassword;
    const newUser = new User(req.body);
    await newUser.save();

    return successResponse(res, null, "Create user successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [POST] api/v1/users/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });
    if (!user) return errorResponse(res, error, httpStatus.BAD_REQUEST, "User does not exist");

    await User.updateOne({ _id: id }, req.body);

    return successResponse(res, null, "Edit user successfully");
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

    await User.deleteOne({ _id: id });

    return successResponse(res, null, "Delete user successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};
