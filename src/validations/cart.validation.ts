import { Request, Response, NextFunction } from "express";

import baseJoi from "./base.joi";

import { errorResponse } from "../helpers/response.helper";

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cartSchema = baseJoi.object({
      productId: baseJoi.string().required(),
      quantity: baseJoi.number().required()
    });

    const { error } = cartSchema.validate(req.body);

    if (error) {
      errorResponse(res, error);
      return;
    }

    next();
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};
