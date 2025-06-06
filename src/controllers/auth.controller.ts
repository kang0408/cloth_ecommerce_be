import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import { Request, Response } from "express";

import User from "../models/users.model";
import Otp from "../models/otps.model";

import { successResponse, errorResponse } from "../helpers/response.helper";
import * as mailHelper from "../helpers/sendMail.helper";

// [POST] api/v1/auth/register
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, role } = req.body;

    const user = await User.findOne({ email: email });
    if (user) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "Email already exist");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashPassword,
      role
    });

    await newUser.save();

    successResponse(res, null, "Register successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [POST] api/v1/auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      errorResponse(res, null, httpStatus.NOT_FOUND, "Email does not exist");
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "Password is not correct");
      return;
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "",
      {
        expiresIn: "3d"
      }
    );

    successResponse(
      res,
      {
        id: user._id,
        username: user.username,
        joined: user.createdAt,
        role: user.role,
        accessToken: token
      },
      "Login successfully"
    );
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [POST] api/v1/auth/forgot-password
export const forgot = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      errorResponse(res, null, httpStatus.NOT_FOUND, "Email does not exist");
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const time = 5;
    const expire = time * 60 * 1000;

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

    await mailHelper.sendMail(String(email), subject, html);

    successResponse(res, null, "OTP sent to email");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [POST] api/v1/auth/reset-password
export const reset = async (req: Request, res: Response) => {
  try {
    const { verifyToken, newPassword } = req.body;

    const decoded = jwt.verify(verifyToken, process.env.JWT_SECRET || "");
    if (!decoded) {
      errorResponse(res, Error, httpStatus.BAD_REQUEST, "Token is not valid");
      return;
    }

    const { emailDecoded } = decoded as JwtPayload;
    const user = await User.findOne({ email: emailDecoded });
    if (!user) {
      errorResponse(res, null, httpStatus.NOT_FOUND, "Email does not exist");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne({ email: emailDecoded }, { password: hashPassword });

    await Otp.deleteMany({ email: emailDecoded });

    successResponse(res, null, "Reset password successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [POST] api/v1/auth/change-password
export const change = async (req: Request, res: Response) => {
  try {
    const { oldPassword, newPassword, verifyToken } = req.body;

    const decoded = jwt.verify(verifyToken, process.env.JWT_SECRET || "");
    if (!decoded) {
      errorResponse(res, Error, httpStatus.BAD_REQUEST, "Token is not valid");
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findOne({ _id: req.user.id });
    if (!user) {
      errorResponse(res, null, httpStatus.NOT_FOUND, "Email does not exist");
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "Old password is not correct");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashNewPassword = await bcrypt.hash(newPassword, salt);

    await User.updateOne({ _id: req.user.id }, { password: hashNewPassword });

    successResponse(res, null, "Change password successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};
