const { default: httpStatus } = require("http-status");

const successResponse = (res, data, message = "Success") => {
  return res.status(httpStatus.OK).json({
    success: true,
    message: message,
    data
  });
};

const errorResponse = (res, error, statusCode = 500, message = "Error") => {
  return res.status(statusCode).json({
    success: false,
    message: message,
    error: error.message
  });
};

module.exports = {
  successResponse,
  errorResponse
};
