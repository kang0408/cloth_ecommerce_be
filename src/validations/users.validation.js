const baseJoi = require("./base.joi");
const { errorResponse } = require("../helpers/response.helper");

module.exports.create = async (req, res, next) => {
  try {
    const userSchema = baseJoi.object({
      username: baseJoi.string().min(5).max(20).required().messages({
        "string.min": "Username is too short",
        "string.max": "Username exceeds 20 characters"
      }),
      email: baseJoi.string().email().required().messages({
        "string.email": "Invalid email format"
      }),
      role: baseJoi.string().valid("user", "admin").optional()
    });

    const response = userSchema.validate(req.body);

    if (response.error) return errorResponse(res, response.error);
    else next();
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};

module.exports.edit = async (req, res, next) => {
  try {
    const userSchema = baseJoi.object({
      username: baseJoi.string().min(5).max(20).optional().messages({
        "string.min": "Username is too short",
        "string.max": "Username exceeds 20 characters"
      }),
      email: baseJoi.string().email().optional().messages({
        "string.email": "Invalid email format"
      }),
      role: baseJoi.string().valid("user", "admin").optional()
    });

    const response = userSchema.validate(req.body);

    if (response.error) return errorResponse(res, response.error);
    else next();
  } catch (error) {
    return errorResponse(res, error, 400);
  }
};
