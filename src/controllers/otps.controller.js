const jwt = require("jsonwebtoken");
const { default: httpStatus } = require("http-status");

const User = require("../models/users.model");
const Otp = require("../models/otps.model");
const mailHelper = require("../helpers/sendMail.helper");

const { successResponse, errorResponse } = require("../helpers/response.helper");

// [POST] api/v1/otp/send-otp
module.exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const isExist = await User.findOne({ email: email });
    if (!isExist) return errorResponse(res, null, httpStatus.NOT_FOUND, "Email does not exist");

    const otp = Math.floor(100000 + Math.random() * 900000);
    const time = 5;
    const expire = time * 60 * 1000;

    const hasOtp = await Otp.findOne({ email: email });
    if (hasOtp)
      return errorResponse(
        res,
        null,
        httpStatus.BAD_REQUEST,
        `You only can send new otp after ${time} minutes`
      );

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

// [POST] api/v1/otp/verify-otp
module.exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await Otp.findOne({ email: email, otp: otp });
    if (!otpRecord) return errorResponse(res, null, httpStatus.BAD_REQUEST, "OTP is not valid");

    if (otpRecord.expiresAt < new Date()) {
      return errorResponse(res, null, httpStatus.BAD_REQUEST, "OTP is expired");
    }

    await Otp.deleteOne({ _id: otpRecord._id });

    const verifyToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "5m" });

    return successResponse(res, { verifyToken }, "Verify OTP successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};
