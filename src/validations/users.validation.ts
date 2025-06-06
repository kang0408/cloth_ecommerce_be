import { Request, Response, NextFunction } from "express";

import baseJoi from "./base.joi";

import { errorResponse } from "../helpers/response.helper";

export const create = async (req: Request, res: Response, next: NextFunction) => {
  const userSchema = baseJoi.object({
    username: baseJoi.string().min(5).max(20).required().messages({
      "string.min": "Username is too short",
      "string.max": "Username exceeds 20 characters"
    }),
    email: baseJoi.string().email().required().messages({
      "string.email": "Invalid email format"
    }),
    role: baseJoi.string().valid("user", "admin").optional(),
    avatar: baseJoi.string().optional()
  });

  const { error } = userSchema.validate(req.body);

  if (error) {
    errorResponse(res, error);
    return;
  }

  next();
};

export const edit = async (req: Request, res: Response, next: NextFunction) => {
  const userSchema = baseJoi.object({
    username: baseJoi.string().min(5).max(20).optional().messages({
      "string.min": "Username is too short",
      "string.max": "Username exceeds 20 characters"
    }),
    email: baseJoi.string().email().optional().messages({
      "string.email": "Invalid email format"
    }),
    role: baseJoi.string().valid("user", "admin").optional()
  });

  const { error } = userSchema.validate(req.body);

  if (error) {
    errorResponse(res, error);
    return;
  }

  next();
};
