import { Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import passport from "passport";

import * as authService from "../services/auth.services";
import { successResponse, errorResponse } from "../helpers/response.helper";
import { IUserJWT } from "../types/user.types";

// [POST] /auth/register
export const register = async (req: Request, res: Response) => {
  try {
    await authService.register(req.body);
    successResponse(res, null, "Register successfully");
  } catch (error: any) {
    errorResponse(res, null, error.status || 500, error.message || "Register failed");
  }
};

// [POST] /auth/login
export const login = async (req: Request, res: Response) => {
  try {
    const data = await authService.login(req.body);

    res.cookie("accessToken", data.accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000
    });

    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    successResponse(res, data, "Login successfully");
  } catch (error: any) {
    errorResponse(res, null, error.status || 500, error.message || "Login failed");
  }
};

// [POST] /auth/forgot
export const forgot = async (req: Request, res: Response) => {
  try {
    await authService.forgotPassword(req.body.email);
    successResponse(res, null, "Send OTP successfully");
  } catch (error: any) {
    errorResponse(res, null, error.status || 500, error.message || "Send OTP failed");
  }
};

// [POST] /auth/reset
export const reset = async (req: Request, res: Response) => {
  try {
    await authService.resetPassword(req.body);
    successResponse(res, null, "Reset password successfully");
  } catch (error: any) {
    errorResponse(res, null, error.status || 500, error.message || "Reset password failed");
  }
};

// [PUT] /auth/change-password
export const changePassword = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as IUserJWT)?.id;
    await authService.changePassword({ ...req.body, userId });
    successResponse(res, null, "Change password successfully");
  } catch (error: any) {
    errorResponse(res, null, error.status || 500, error.message || "Change password failed");
  }
};

// [GET] /auth/refresh-token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.cookies?.refreshToken;
    if (!token) {
      errorResponse(res, null, httpStatus.NOT_FOUND, "Refresh token not found");
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as IUserJWT;

    const newAccessToken = jwt.sign(
      { id: decoded.id, role: decoded.role, email: decoded.email },
      process.env.JWT_SECRET || "",
      { expiresIn: "3d" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60 * 1000
    });

    successResponse(
      res,
      {
        accessToken: newAccessToken
      },
      "Refresh token successfully"
    );
  } catch (error: any) {
    errorResponse(res, null, error.status || 500, error.message || "Refresh token failed");
  }
};

export const googleCallback = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUserJWT;

    const accessToken = jwt.sign(
      { id: user?.id, email: user?.email, role: user?.role },
      process.env.JWT_SECRET || "",
      {
        expiresIn: "3d"
      }
    );

    const refreshToken = jwt.sign(
      { id: user?.id, email: user?.email, role: user?.role },
      process.env.JWT_SECRET || "",
      {
        expiresIn: "7d"
      }
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3 * 24 * 60 * 60 * 1000
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.redirect(process.env.CLIENT_URL || "");
  } catch (error) {
    errorResponse(res, null, httpStatus.INTERNAL_SERVER_ERROR, "failed");
  }
};
