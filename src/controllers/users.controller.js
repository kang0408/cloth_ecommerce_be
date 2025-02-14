const User = require("../models/users.model");

const { successResponse, errorResponse } = require("../helpers/response.helper");

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
