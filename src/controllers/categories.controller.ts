// controller/category.controller.ts
import httpStatus from "http-status";
import { Request, Response } from "express";
import {
  getCategoriesService,
  getAllCategoriesService,
  getCategoryDetailsService,
  editCategoryService,
  createCategoryService,
  deleteCategoryService
} from "../services/categories.services";
import { successResponse, errorResponse } from "../helpers/response.helper";

export const categories = async (req: Request, res: Response) => {
  try {
    const data = await getCategoriesService(req);
    successResponse(res, data, "Get all categories successfully");
  } catch (error) {
    errorResponse(res, error);
  }
};

export const allCates = async (_req: Request, res: Response) => {
  try {
    const cates = await getAllCategoriesService();
    successResponse(res, cates, "Get all categories successfully");
  } catch (error) {
    errorResponse(res, error);
  }
};

export const details = async (req: Request, res: Response) => {
  try {
    const data = await getCategoryDetailsService(req.params.id);
    if (!data) {
      errorResponse(res, null, httpStatus.NOT_FOUND, "Category not found");
      return;
    }
    successResponse(res, data, "Get details category successfully");
  } catch (error) {
    errorResponse(res, error);
  }
};

export const edit = async (req: Request, res: Response) => {
  try {
    const result = await editCategoryService(req.params.id, req.body);
    if (!result) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "No changes applied");
      return;
    }
    successResponse(res, result, "Update category successfully");
  } catch (error) {
    errorResponse(res, error);
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const result = await createCategoryService(req.body);
    successResponse(res, result, "Create category successfully");
  } catch (error) {
    errorResponse(res, error);
  }
};

export const deleteCate = async (req: Request, res: Response) => {
  try {
    await deleteCategoryService(req.params.id, req.query.sortType as string);
    successResponse(res, null, "Delete category successfully");
  } catch (error) {
    errorResponse(res, error);
  }
};
