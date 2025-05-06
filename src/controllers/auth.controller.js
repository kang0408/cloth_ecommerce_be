const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { default: httpStatus } = require("http-status");

const User = require("../models/users.model");
const Otp = require("../models/otps.model");

const { successResponse, errorResponse } = require("../helpers/response.helper");
const mailHelper = require("../helpers/sendMail.helper");

// [POST] api/v1/auth/register
module.exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const user = await User.findOne({ email: email });
    if (user) return errorResponse(res, null, httpStatus.BAD_REQUEST, "Email already exist");

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
    return errorResponse(res, error);
  }
};

// [POST] api/v1/auth/login
module.exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) return errorResponse(res, null, httpStatus.NOT_FOUND, "Email does not exist");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return errorResponse(res, null, httpStatus.BAD_REQUEST, "Password is not correct");

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "3d"
      }
    );

    return successResponse(
      res,
      {
        id: user._id,
        username: user.username,
        joined: user.createdAt,
        role: user.role,
        accessToken: token
      },
      "Login successfully"
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [POST] api/v1/auth/forgot-password
module.exports.forgot = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) return errorResponse(res, null, httpStatus.NOT_FOUND, "Email does not exist");

    const otp = Math.floor(100000 + Math.random() * 900000);
    const time = 5;
    const expire = time * 60 * 1000;

    const newOtp = new Otp({
      email,
      otp,
      expiresAt: new Date(Date.now() + expire)
    });

    await newOtp.save();

    const subject = "OTP Verification Code for Password Recovery";
    const html = `
      Your OTP verification code for password recovery is <b>${otp}</b> (Valid for ${time} minutes).
      Please do not share this OTP with anyone.
    `;

    await mailHelper.sendMail(email, subject, html);

    return successResponse(res, null, "OTP sent to email");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [POST] api/v1/auth/reset-password
module.exports.reset = async (req, res) => {
  try {
    const { verifyToken, newPassword } = req.body;

    const decoded = jwt.verify(verifyToken, process.env.JWT_SECRET);
    if (!decoded) return errorResponse(res, error, httpStatus.BAD_REQUEST, "Token is not valid");

    const user = await User.findOne({ email: decoded.email });
    if (!user) return errorResponse(res, null, httpStatus.NOT_FOUND, "Email does not exist");

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne({ email: decoded.email }, { password: hashPassword });

    await Otp.deleteMany({ email: decoded.email });

    return successResponse(res, null, "Reset password successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [POST] api/v1/auth/change-password
module.exports.change = async (req, res) => {
  try {
    const { oldPassword, newPassword, verifyToken } = req.body;

    const decoded = jwt.verify(verifyToken, process.env.JWT_SECRET);
    if (!decoded) return errorResponse(res, error, httpStatus.BAD_REQUEST, "Token is not valid");

    const user = await User.findOne({ _id: req.user.id });
    if (!user) return errorResponse(res, null, httpStatus.NOT_FOUND, "Email does not exist");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return errorResponse(res, null, httpStatus.BAD_REQUEST, "Old password is not correct");

    const salt = await bcrypt.genSalt(10);
    const hashNewPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne({ _id: req.user.id }, { password: hashNewPassword });

    return successResponse(res, null, "Change password successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};
