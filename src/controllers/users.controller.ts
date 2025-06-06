import bcrypt from "bcrypt";
import httpStatus from "http-status";
import { Request, Response } from "express";

import User from "../models/users.model";

import paginationHandler from "../helpers/pagination.helper";
import sortHandler from "../helpers/sort.helper";
import { successResponse, errorResponse } from "../helpers/response.helper";
import cloudinary from "../configs/cloudinary";

// [GET] api/v1/users
export const users = async (req: Request, res: Response) => {
  try {
    // Sort
    const sort = sortHandler(req.query);

    // Search
    const find: { email?: object } = {};
    if (req.query.search) {
      find.email = { $regex: req.query.search, $options: "i" };
    }

    // Pagination
    const paginationDefault = { currentPage: 1, limitPage: 5 };
    const pageTotal = await User.countDocuments(find);
    const paginationObject = paginationHandler(paginationDefault, pageTotal, req.query);

    const users = await User.find(find)
      .skip(paginationObject.offset ?? 0)
      .limit(paginationObject.limitPage)
      .sort(sort)
      .select("-__v -password -cloudinary_id -favourites");

    successResponse(
      res,
      {
        users,
        totalUsers: pageTotal,
        totalPages: paginationObject.totalPage,
        currentPage: paginationObject.currentPage
      },
      "Get all users successfully"
    );
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [GET] api/v1/users/profile
export const profileByAuth = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id, role } = req.user;

    let select = "-__v -password -cloudinary_id";
    if (role === "admin") select += " -favourites";

    const data = await User.findOne({ _id: id }).select(select);

    successResponse(res, data, "Get profile successfully");
    return;
  } catch (error) {
    errorResponse(res, error, 500, "Get profile failure");
    return;
  }
};

// [GET] api/v1/users/profile/:id
export const profileById = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { role } = req.user;
    const { id } = req.params;

    let select = "-__v -password -cloudinary_id";
    if (role === "admin") select += " -favourites";

    const data = await User.findOne({ _id: id }).select(select);

    successResponse(res, data, "Get profile successfully");
    return;
  } catch (error) {
    errorResponse(res, error, 500, "Get profile failure");
    return;
  }
};

// [POST] api/v1/users/create
export const create = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email });
    if (user) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "Email is existed");
      return;
    }

    const defaultPassword = "Abc@12345";

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(defaultPassword, salt);

    req.body.password = hashPassword;

    let newUser;
    if (Array.isArray(req.files) && req.files.length > 0) {
      // using cloudinary.uploader.upload() to upload image in cloundinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${req.files[0].buffer.toString("base64")}`,
        {
          folder: "clothes-management/users",
          resource_type: "image"
        }
      );

      req.body.avatar = result.secure_url;
      req.body.cloudinary_id = result.public_id;
    }
    newUser = new User(req.body);

    await newUser.save();

    successResponse(res, null, "Create user successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [PATCH] api/v1/users/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });
    if (!user) {
      errorResponse(res, Error, httpStatus.NOT_FOUND, "User not found");
      return;
    }

    if (user.cloudinary_id) await cloudinary.uploader.destroy(user.cloudinary_id);

    // checking avatar/files
    if (Array.isArray(req.files) && req.files.length > 0) {
      // using cloudinary.uploader.upload() to upload image in cloundinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${req.files[0].buffer.toString("base64")}`,
        {
          folder: "clothes-management/users",
          resource_type: "image"
        }
      );

      req.body.avatar = result.secure_url;
      req.body.cloudinary_id = result.public_id;
    }

    await User.updateOne({ _id: id }, req.body);

    successResponse(res, null, "Edit user successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [PATCH] api/v1/users/update-profile
export const updateProfileByAuth = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const { id, email: userEmail } = req.user;
    const { email } = req.body;

    const user = await User.findOne({ _id: id });
    if (!user) {
      errorResponse(res, Error, httpStatus.NOT_FOUND, "User not found");
      return;
    }

    if (email !== userEmail) {
      const isExisted = await User.findOne({ email: email });
      if (isExisted) {
        errorResponse(res, null, httpStatus.BAD_REQUEST, "Email is existed");
        return;
      }
    }

    if (user.cloudinary_id) await cloudinary.uploader.destroy(user.cloudinary_id);

    // checking avatar/files
    if (Array.isArray(req.files) && req.files.length > 0) {
      // using cloudinary.uploader.upload() to upload image in cloundinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${req.files[0].buffer.toString("base64")}`,
        {
          folder: "clothes-management/users",
          resource_type: "image"
        }
      );

      req.body.avatar = result.secure_url;
      req.body.cloudinary_id = result.public_id;
    }

    await User.updateOne({ _id: id }, req.body);

    let select = "-__v -password -cloudinary_id";
    const data = await User.findOne({ _id: id }).select(select);

    successResponse(res, data, "User updated successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [DELETE] api/v1/users/delete/:id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ _id: id });
    if (!user) {
      errorResponse(res, Error, httpStatus.BAD_REQUEST, "User does not exist");
      return;
    }

    if (user.avatar && user.cloudinary_id) await cloudinary.uploader.destroy(user.cloudinary_id);

    await User.deleteOne({ _id: id });

    successResponse(res, null, "Delete user successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};
