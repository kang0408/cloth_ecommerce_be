const baseJoi = require("./base.joi");
const { errorResponse } = require("../helpers/response.helper");

module.exports.sendOtp = async (req, res, next) => {
  try {
    const otpSchema = baseJoi.object({
      email: baseJoi.string().email().required().messages({
        "string.email": "Invalid email format"
      })
    });

    const response = otpSchema.validate(req.body);

    if (response.error) return errorResponse(res, response.error);
    else next();
  } catch (error) {
    return errorResponse(res, error);
  }
};

module.exports.verifyOtp = async (req, res, next) => {
  try {
    const otpSchema = baseJoi.object({
      email: baseJoi.string().email().required().messages({
        "string.email": "Invalid email format"
      }),
      otp: baseJoi
        .string()
        .min(0)
        .max(6)
        .required()
        .custom((value, helpers) => {
          if (value === "") {
            return helpers.message("OTP is required.");
          }
          if (!/^\d{6}$/.test(value)) {
            return helpers.message("OTP is not valid.");
          }
          return value;
        })
    });

    const response = otpSchema.validate(req.body);

    if (response.error) return errorResponse(res, response.error);
    else next();
  } catch (error) {
    return errorResponse(res, error);
  }
};
