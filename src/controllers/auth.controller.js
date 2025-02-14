const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users.model");

const { successResponse, errorResponse } = require("../helpers/response.helper");

// [POST] api/v1/auth/register
module.exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const user = await User.findOne({ email: email });
    if (user) return errorResponse(res, null, 409, "Email already exist");

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashPassword,
      role
    });

    await newUser.save();

    return successResponse(res, null, "Register successfully");
  } catch (error) {
    return errorResponse(res, error, 400, "Register fail");
  }
};

// [POST] api/v1/auth/login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) return errorResponse(res, null, 404, "Email does not exist");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return errorResponse(res, null, 400, "Password is not correct");

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "3d"
    });

    return successResponse(
      res,
      {
        id: user._id,
        name: user.name,
        email: email.email,
        role: user.role,
        accessToken: token
      },
      "Login successfully"
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};
