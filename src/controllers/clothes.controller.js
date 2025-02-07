const { default: httpStatus } = require("http-status");

const Cloth = require("../models/clothes.model");

// [GET] api/v1/clothes
module.exports.clothes = async (req, res) => {
  const find = {
    deleted: false
  };

  const clothes = await Cloth.find(find);

  return res.status(httpStatus.OK).json({
    data: clothes
  });
};
