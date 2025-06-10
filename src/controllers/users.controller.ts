import { Request, Response } from "express";
import httpStatus from "http-status";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateProfile,
  deleteUserById
} from "../services/users.services";
import paginationHandler from "../helpers/pagination.helper";
import sortHandler from "../helpers/sort.helper";
import { successResponse, errorResponse } from "../helpers/response.helper";

import { IUserJWT } from "../types/user.types";

// [GET] api/v1/users
export const users = async (req: Request, res: Response) => {
  try {
    const sort = sortHandler(req.query);

    const find: { email?: object } = {};
    if (req.query.search) {
      find.email = { $regex: req.query.search, $options: "i" };
    }

    const paginationDefault = { currentPage: 1, limitPage: 5 };
    const pageTotal = await getAllUsers(find, { skip: 0, limit: 0 }, {});
    const paginationObject = paginationHandler(paginationDefault, pageTotal.total, req.query);

    const { users, total } = await getAllUsers(
      find,
      { skip: paginationObject.offset ?? 0, limit: paginationObject.limitPage },
      sort
    );

    successResponse(
      res,
      {
        users,
        totalUsers: total,
        totalPages: paginationObject.totalPage,
        currentPage: paginationObject.currentPage
      },
      "Get all users successfully"
    );
  } catch (error) {
    errorResponse(res, error);
  }
};

// [GET] api/v1/users/profile
export const profileByAuth = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id, role } = req.user as IUserJWT;

    const data = await getUserById(id, role);

    successResponse(res, data, "Get profile successfully");
  } catch (error) {
    errorResponse(res, error, 500, "Get profile failure");
  }
};

// [GET] api/v1/users/profile/:id
export const profileById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { role } = req.user as IUserJWT;
    const { id } = req.params;

    const data = await getUserById(id, role);

    successResponse(res, data, "Get profile successfully");
  } catch (error) {
    errorResponse(res, error, 500, "Get profile failure");
  }
};

// [POST] api/v1/users/create
export const create = async (req: Request, res: Response) => {
  try {
    const file = Array.isArray(req.files) && req.files.length > 0 ? req.files[0] : undefined;

    await createUser(req.body, file);

    successResponse(res, null, "Create user successfully");
  } catch (error) {
    if ((error as Error).message === "Email is existed") {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "Email is existed");
      return;
    }
    errorResponse(res, error);
  }
};

// [PATCH] api/v1/users/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const file = Array.isArray(req.files) && req.files.length > 0 ? req.files[0] : undefined;

    await updateUser(id, req.body, file);

    successResponse(res, null, "Edit user successfully");
  } catch (error) {
    if ((error as Error).message === "User not found") {
      errorResponse(res, Error, httpStatus.NOT_FOUND, "User not found");
      return;
    }
    errorResponse(res, error);
  }
};

// [PATCH] api/v1/users/update-profile
export const updateProfileByAuth = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id, email: userEmail } = req.user as IUserJWT;
    const file = Array.isArray(req.files) && req.files.length > 0 ? req.files[0] : undefined;

    const data = await updateProfile(id, userEmail, req.body, file);

    successResponse(res, data, "User updated successfully");
  } catch (error) {
    if ((error as Error).message === "User not found") {
      errorResponse(res, Error, httpStatus.NOT_FOUND, "User not found");
      return;
    }
    if ((error as Error).message === "Email is existed") {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "Email is existed");
      return;
    }
    errorResponse(res, error);
  }
};

// [DELETE] api/v1/users/delete/:id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await deleteUserById(id);
    successResponse(res, null, "Delete user successfully");
  } catch (error) {
    if ((error as Error).message === "User does not exist") {
      errorResponse(res, Error, httpStatus.BAD_REQUEST, "User does not exist");
      return;
    }
    errorResponse(res, error);
  }
};
