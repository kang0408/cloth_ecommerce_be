import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";

import User from "../models/users.model";
import Otp from "../models/otps.model";
import * as mailHelper from "../helpers/sendMail.helper";

export const register = async ({
  username,
  email,
  password,
  role
}: {
  username: string;
  email: string;
  password: string;
  role: string;
}) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw { status: httpStatus.BAD_REQUEST, message: "Email already exists" };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    role
  });

  await newUser.save();
};

export const login = async ({ email, password }: { email: string; password: string }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw { status: httpStatus.NOT_FOUND, message: "Email does not exist" };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw {
      status: httpStatus.BAD_REQUEST,
      message: "Password is not correct"
    };
  }

  const accessToken = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || "",
    { expiresIn: "3d" }
  );

  const refreshToken = jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET || "",
    { expiresIn: "7d" }
  );

  return {
    id: user._id,
    username: user.username,
    joined: user.createdAt,
    role: user.role,
    accessToken: accessToken,
    refreshToken: refreshToken
  };
};

export const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw { status: httpStatus.NOT_FOUND, message: "Email does not exist" };
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
};

export const resetPassword = async ({
  verifyToken,
  newPassword
}: {
  verifyToken: string;
  newPassword: string;
}) => {
  const decoded = jwt.verify(verifyToken, process.env.JWT_SECRET || "") as any;
  if (!decoded?.emailDecoded) {
    throw { status: httpStatus.BAD_REQUEST, message: "Token is not valid" };
  }

  const user = await User.findOne({ email: decoded.emailDecoded });
  if (!user) {
    throw { status: httpStatus.NOT_FOUND, message: "Email does not exist" };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await User.updateOne({ email: decoded.emailDecoded }, { password: hashedPassword });

  await Otp.deleteMany({ email: decoded.emailDecoded });
};

export const changePassword = async ({
  userId,
  oldPassword,
  newPassword
}: {
  userId: string;
  oldPassword: string;
  newPassword: string;
}) => {
  const user = await User.findById(userId);
  if (!user) {
    throw { status: httpStatus.NOT_FOUND, message: "User not found" };
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw {
      status: httpStatus.BAD_REQUEST,
      message: "Old password is not correct"
    };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);

  await User.updateOne({ _id: userId }, { password: hashedNewPassword });
};
