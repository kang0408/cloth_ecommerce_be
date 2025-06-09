import { Request, Response } from "express";

import { sendOtpService, verifyOtpService } from "../services/otp.services";
import { successResponse, errorResponse } from "../helpers/response.helper";

// [POST] api/v1/otp/send-otp
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await sendOtpService(email);
    successResponse(res, null, "OTP sent to email");
  } catch (error: any) {
    errorResponse(res, null, error.status || 500, error.message || "Internal server error");
  }
};

// [POST] api/v1/otp/verify-otp
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    const data = await verifyOtpService(email, otp);
    successResponse(res, data, "Verify OTP successfully");
  } catch (error: any) {
    errorResponse(res, null, error.status || 500, error.message || "Internal server error");
  }
};
