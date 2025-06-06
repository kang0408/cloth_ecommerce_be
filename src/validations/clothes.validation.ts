import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";

import baseJoi from "./base.joi";

import { errorResponse } from "../helpers/response.helper";

export const createCloth = async (req: Request, res: Response, next: NextFunction) => {
  const clothSchema = baseJoi.object({
    title: baseJoi.string().min(5).max(255).required(),
    description: baseJoi.string().min(5).max(255).required(),
    price: baseJoi.number().min(0).messages({
      "number.min": "Invalid price."
    }),
    discountPercentage: baseJoi.number().min(0).max(100).messages({
      "number.min": "Invalid discount percentage.",
      "number.max": "Discount percentage cannot exceed 100%."
    }),
    stock: baseJoi.number().min(0).messages({
      "number.min": "Invalid stock quantity."
    }),
    thumbnail: baseJoi.string(),
    status: baseJoi.string().valid("active", "inactive").optional(),
    categories: baseJoi.string().optional()
  });

  const { error } = clothSchema.validate(req.body);

  if (error) {
    errorResponse(res, error);
    return;
  }

  next();
};

export const editCloth = async (req: Request, res: Response, next: NextFunction) => {
  const clothSchema = baseJoi.object({
    title: baseJoi.string().min(5).max(255),
    description: baseJoi.string().min(5).max(255),
    price: baseJoi.number().min(0).messages({
      "number.min": "Invalid price."
    }),
    discountPercentage: baseJoi.number().min(0).max(100).messages({
      "number.min": "Invalid discount percentage.",
      "number.max": "Discount percentage cannot exceed 100%."
    }),
    stock: baseJoi.number().min(0).messages({
      "number.min": "Invalid stock quantity."
    }),
    thumbnail: baseJoi.string(),
    status: baseJoi.string().valid("active", "inactive").optional(),
    categories: baseJoi.string().optional()
  });

  const { error } = clothSchema.validate(req.body);

  if (error) {
    errorResponse(res, error);
    return;
  }

  next();
};
