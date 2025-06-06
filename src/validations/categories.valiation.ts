import { Request, Response, NextFunction } from "express";

import baseJoi from "./base.joi";

import { errorResponse } from "../helpers/response.helper";

export const createCate = async (req: Request, res: Response, next: NextFunction) => {
  const cateSchema = baseJoi.object({
    name: baseJoi.string().min(5).max(255).required(),
    description: baseJoi.string().min(5).max(255).required(),
    status: baseJoi.string().valid("active", "inactive").optional(),
    parentId: baseJoi.array().optional()
  });

  const { error } = cateSchema.validate(req.body);

  if (error) {
    errorResponse(res, error);
    return;
  }

  next();
};

export const editCate = async (req: Request, res: Response, next: NextFunction) => {
  const cateSchema = baseJoi.object({
    name: baseJoi.string().min(5).max(255),
    description: baseJoi.string().min(5).max(255),
    status: baseJoi.string().valid("active", "inactive").optional(),
    parentId: baseJoi.array().optional()
  });

  const { error } = cateSchema.validate(req.body);

  if (error) {
    errorResponse(res, error);
    return;
  }

  next();
};
