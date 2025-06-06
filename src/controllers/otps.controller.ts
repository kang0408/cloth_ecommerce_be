import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { Request, Response } from "express";

import * as mailHelper from "../helpers/sendMail.helper";
import { successResponse, errorResponse } from "../helpers/response.helper";

import User from "../models/users.model";
import Otp from "../models/otps.model";

// [POST] api/v1/otp/send-otp
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const isExist = await User.findOne({ email: email });
    if (!isExist) {
      errorResponse(res, null, httpStatus.NOT_FOUND, "Email does not exist");
      return;
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const time = 5;
    const expire = time * 60 * 1000;

    const hasOtp = await Otp.findOne({ email: email });
    if (hasOtp) {
      errorResponse(
        res,
        null,
        httpStatus.BAD_REQUEST,
        `You only can send new otp after ${time} minutes`
      );
      return;
    }

    const newOtp = new Otp({
      email,
      otp,
      expiresAt: new Date(Date.now() + expire)
    });

    await newOtp.save();

    const subject = "OTP Verification Code for Password Recovery";
    const html = `
      Your OTP verification code for password recovery is <b>${otp}</b> (Valid for ${time} minutes).
      Please do not share this OTP with anyone.
    `;

    await mailHelper.sendMail(email, subject, html);

    successResponse(res, null, "OTP sent to email");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [POST] api/v1/otp/verify-otp
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const otpRecord = await Otp.findOne({ email: email, otp: otp });
    if (!otpRecord) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "OTP is not valid");
      return;
    }

    if (otpRecord.expiresAt < new Date()) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "OTP is expired");
      return;
    }

    await Otp.deleteOne({ _id: otpRecord._id });

    const verifyToken = jwt.sign({ email }, process.env.JWT_SECRET || "", { expiresIn: "5m" });

    successResponse(res, { verifyToken }, "Verify OTP successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};
