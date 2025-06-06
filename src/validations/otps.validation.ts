import { Request, Response, NextFunction } from "express";

import baseJoi from "./base.joi";

import { errorResponse } from "../helpers/response.helper";

export const sendOtp = async (req: Request, res: Response, next: NextFunction) => {
  const otpSchema = baseJoi.object({
    email: baseJoi.string().email().required().messages({
      "string.email": "Invalid email format"
    })
  });

  const { error } = otpSchema.validate(req.body);

  if (error) {
    errorResponse(res, error);
    return;
  }

  next();
};

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
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
          return helpers.error("any.custom", {
            message: "OTP is required."
          });
        }
        if (!/^\d{6}$/.test(value)) {
          return helpers.error("any.custom", {
            message: "OTP is not valid."
          });
        }
        return value;
      })
  });

  const { error } = otpSchema.validate(req.body);

  if (error) {
    errorResponse(res, error);
    return;
  }

  next();
};
