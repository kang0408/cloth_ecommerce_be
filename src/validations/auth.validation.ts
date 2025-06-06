import { Request, Response, NextFunction } from "express";

import baseJoi from "./base.joi";

import { errorResponse } from "../helpers/response.helper";

const validatePassword = (value: string, helpers: any) => {
  if (!/^(?=.*[0-9])(?=.*[A-Za-z])\S{8,}$/.test(value)) {
    return helpers.error("any.custom", {
      message: "Password must be at least 8 characters long and contain both letters and numbers."
    });
  }
  return value;
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userSchema = baseJoi.object({
      username: baseJoi.string().min(5).max(20).required().messages({
        "string.min": "Username is too short",
        "string.max": "Username exceeds 20 characters"
      }),
      email: baseJoi.string().email().required().messages({
        "string.email": "Invalid email format"
      }),
      password: baseJoi.string().required().custom(validatePassword),
      role: baseJoi.string().valid("user", "admin").optional()
    });

    const { error } = userSchema.validate(req.body);

    if (error) {
      errorResponse(res, error);
      return;
    }

    next();
  } catch (error) {
    errorResponse(res, error, 400);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userSchema = baseJoi.object({
      username: baseJoi.string().min(5).max(20).optional().messages({
        "string.min": "Username is too short",
        "string.max": "Username exceeds 20 characters"
      }),
      email: baseJoi.string().email().required().messages({
        "string.email": "Invalid email format"
      }),
      password: baseJoi.string().required().custom(validatePassword)
    });

    const { error } = userSchema.validate(req.body);

    if (error) {
      errorResponse(res, error);
      return;
    }

    next();
  } catch (error) {
    errorResponse(res, error, 400);
  }
};

export const forgot = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userSchema = baseJoi.object({
      email: baseJoi.string().email().required().messages({
        "string.email": "Invalid email format"
      })
    });

    const { error } = userSchema.validate(req.body);

    if (error) {
      errorResponse(res, error);
      return;
    }

    next();
  } catch (error) {
    errorResponse(res, error, 400);
  }
};

export const reset = async (req: Request, res: Response, next: NextFunction) => {
  const userSchema = baseJoi.object({
    newPassword: baseJoi.string().required().custom(validatePassword),
    verifyToken: baseJoi.string().required()
  });

  const { error } = userSchema.validate(req.body);

  if (error) {
    errorResponse(res, error);
    return;
  }

  next();
};

export const change = async (req: Request, res: Response, next: NextFunction) => {
  const userSchema = baseJoi.object({
    oldPassword: baseJoi.string().required().custom(validatePassword),
    newPassword: baseJoi.string().required().custom(validatePassword),
    verifyToken: baseJoi.string().required()
  });

  const { error } = userSchema.validate(req.body);

  if (error) {
    errorResponse(res, error);
    return;
  }

  next();
};
