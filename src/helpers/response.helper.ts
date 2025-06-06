import httpStatus from "http-status";
import { Response } from "express";

import { IErrorResponse, ISuccessResponse } from "../types/response.types";

const successResponse = <T>(res: Response<ISuccessResponse<T>>, data: T, message = "Success") => {
  return res.status(httpStatus.OK).json({
    success: true,
    message: message,
    data
  });
};

const errorResponse = (
  res: Response<IErrorResponse>,
  error: any,
  statusCode: number = 500,
  message?: String
) => {
  return res.status(statusCode).json({
    success: false,
    message: message ? message : error.message
  });
};

export { successResponse, errorResponse };
