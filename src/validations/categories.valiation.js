const baseJoi = require("./base.joi");
const { errorResponse } = require("../helpers/response.helper");

module.exports.createCate = async (req, res, next) => {
  const cateSchema = baseJoi.object({
    name: baseJoi.string().min(5).max(255).required(),
    description: baseJoi.string().min(5).max(255).required(),
    quantity: baseJoi.number().min(0).messages({
      "number.min": "Invalid quantity."
    }),
    image: baseJoi.string(),
    status: baseJoi.string().valid("active", "inactive").optional(),
    parentId: baseJoi.array().optional()
  });

  const response = cateSchema.validate(req.body);

  if (response.error) return errorResponse(res, response.error);
  else {
    next();
  }
};
