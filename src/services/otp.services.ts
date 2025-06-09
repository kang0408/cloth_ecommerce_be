// services/otp.service.ts
import jwt from "jsonwebtoken";
import httpStatus from "http-status";

import * as mailHelper from "../helpers/sendMail.helper";
import User from "../models/users.model";
import Otp from "../models/otps.model";

export const sendOtpService = async (email: string) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const time = 5;
  const expire = time * 60 * 1000;

  const user = await User.findOne({ email });
  if (!user) {
    throw { status: httpStatus.NOT_FOUND, message: "Email does not exist" };
  }

  const hasOtp = await Otp.findOne({ email });
  if (hasOtp) {
    throw {
      status: httpStatus.BAD_REQUEST,
      message: `You only can send new otp after ${time} minutes`
    };
  }

  const newOtp = new Otp({
    email,
    otp,
    expiresAt: new Date(Date.now() + expire)
  });

  await newOtp.save();

  const subject = "OTP Verification Code for Password Recovery";
  const html = `Your OTP verification code for password recovery is <b>${otp}</b> (Valid for ${time} minutes). Please do not share this OTP with anyone.`;

  await mailHelper.sendMail(email, subject, html);

  return;
};

export const verifyOtpService = async (email: string, otp: string) => {
  const otpRecord = await Otp.findOne({ email, otp });
  if (!otpRecord) {
    throw { status: httpStatus.BAD_REQUEST, message: "OTP is not valid" };
  }

  if (otpRecord.expiresAt < new Date()) {
    throw { status: httpStatus.BAD_REQUEST, message: "OTP is expired" };
  }

  await Otp.deleteOne({ _id: otpRecord._id });

  const verifyToken = jwt.sign({ email }, process.env.JWT_SECRET || "", {
    expiresIn: "5m"
  });

  return { verifyToken };
};
