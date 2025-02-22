const baseJoi = require("./base.joi");

const { errorResponse } = require("../helpers/response.helper");

module.exports.addToCart = async (req, res, next) => {
  try {
    const cartSchema = baseJoi.object({
      productId: baseJoi.string().required(),
      quantity: baseJoi.number().required()
    });

    const response = cartSchema.validate(req.body);

    if (response.error) return errorResponse(res, response.error);
    else next();
  } catch (error) {
    return errorResponse(res, error);
  }
};
