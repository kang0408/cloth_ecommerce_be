// src/controllers/clothes.controller.ts
import { Request, Response } from "express";
import httpStatus from "http-status";
import {
  getAllClothesService,
  createClothService,
  editClothService,
  deleteClothService,
  getClothDetailsService,
  getClothesByCategoryService
} from "../services/clothes.services";

import { successResponse, errorResponse } from "../helpers/response.helper";

export const clothes = async (req: Request, res: Response) => {
  try {
    const result = await getAllClothesService(req);
    successResponse(res, result, "Get all clothes successfully");
  } catch (error) {
    errorResponse(res, error);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const result = await createClothService(req);
    successResponse(res, result, "Create cloth successfully");
  } catch (error) {
    errorResponse(res, error);
  }
};

export const edit = async (req: Request, res: Response) => {
  try {
    const result = await editClothService(req);
    successResponse(res, result, "Edit cloth successfully");
  } catch (error) {
    errorResponse(res, error);
  }
};

export const deleteCloth = async (req: Request, res: Response) => {
  try {
    await deleteClothService(req);
    successResponse(res, null, "Delete cloth successfully");
  } catch (error) {
    errorResponse(res, error);
  }
};

export const details = async (req: Request, res: Response) => {
  try {
    const result = await getClothDetailsService(req);
    successResponse(res, result, "Get details cloth successfully");
  } catch (error) {
    errorResponse(res, error);
  }
};

export const clothesByCate = async (req: Request, res: Response) => {
  try {
    const result = await getClothesByCategoryService(req);
    successResponse(res, result, "Get all clothes successfully");
  } catch (error) {
    errorResponse(res, error);
  }
};
