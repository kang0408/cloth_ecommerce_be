const baseJoi = require("./base.joi");
const { errorResponse } = require("../helpers/response.helper");

module.exports.createCate = async (req, res, next) => {
  const cateSchema = baseJoi.object({
    name: baseJoi.string().min(5).max(255).required(),
    description: baseJoi.string().min(5).max(255).required(),
    status: baseJoi.string().valid("active", "inactive").optional(),
    parentId: baseJoi.array().optional()
  });

  const response = cateSchema.validate(req.body);

  if (response.error) return errorResponse(res, response.error);
  else {
    next();
  }
};

module.exports.editCate = async (req, res, next) => {
  const cateSchema = baseJoi.object({
    name: baseJoi.string().min(5).max(255),
    description: baseJoi.string().min(5).max(255),
    status: baseJoi.string().valid("active", "inactive").optional(),
    parentId: baseJoi.array().optional()
  });

  const response = cateSchema.validate(req.body);

  if (response.error) return errorResponse(res, response.error);
  else {
    next();
  }
};
