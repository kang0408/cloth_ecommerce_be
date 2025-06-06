import mongoose, { Types } from "mongoose";
import httpStatus from "http-status";
import { Request, Response } from "express";

import paginationHandler from "../helpers/pagination.helper";
import sortHandler from "../helpers/sort.helper";
import { successResponse, errorResponse } from "../helpers/response.helper";

import Category from "../models/category.model";

// [GET] api/v1/categories
export const categories = async (req: Request, res: Response) => {
  try {
    const { filter } = req.query;

    // Sort
    const sort = sortHandler(req.query);

    // Pagination
    const paginationDefault = { currentPage: 1, limitPage: 5 };
    const pageTotal = await Category.countDocuments({ parentId: { $size: 0 } });
    const paginationObject = paginationHandler(paginationDefault, pageTotal, req.query);

    const cates = await Category.aggregate([
      {
        $lookup: {
          from: "categories",
          let: { categoryId: "$_id" }, // Tạo biến `categoryId`
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $in: ["$$categoryId", "$parentId"] }, // Kiểm tra nếu `_id` của danh mục cha có trong `parentId`
                    { $eq: ["$deleted", false] } // Chỉ lấy subCategories chưa bị xóa
                  ]
                }
              }
            },
            {
              $project: { __v: 0 } // Loại bỏ trường __v khỏi subCategories
            }
          ],
          as: "subCategories"
        }
      },
      {
        $match: {
          parentId: { $size: 0 }, // Chỉ lấy các danh mục có parentId là mảng rỗng []
          deleted: false,
          ...(filter ? { name: { $regex: filter, $options: "i" } } : {})
        }
      },
      {
        $project: { __v: 0 } // Loại bỏ trường __v khỏi danh mục cha
      },
      ...(Object.keys(sort).length > 0
        ? [{ $sort: sort as Record<string, 1 | -1> }]
        : [{ $sort: { createdAt: -1 as -1 } }]),
      {
        $skip: paginationObject.offset ?? 0
      },
      {
        $limit: paginationObject.limitPage ?? 10
      }
    ]);

    successResponse(
      res,
      {
        cates,
        totalCates: pageTotal,
        totalPages: paginationObject.totalPage,
        currentPage: paginationObject.currentPage
      },
      "Get all categories successfully"
    );
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [GET] api/v1/categories/all
export const allCates = async (req: Request, res: Response) => {
  try {
    const cates = await Category.find().select("-__v");

    successResponse(res, cates, "Get all categories successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [GET] api/v1/categories/details/:id
export const details = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const cate = await Category.findOne({ _id: id, deleted: false }).select("-__v");
    if (!cate) {
      errorResponse(res, null, httpStatus.NOT_FOUND, "Category not found");
      return;
    }

    successResponse(res, cate, "Get details cloth successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [PATCH] api/v1/categories/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const cate = await Category.findOne({
      _id: id,
      deleted: false
    });

    if (!cate) {
      errorResponse(res, null, httpStatus.NOT_FOUND, "Category not found");
      return;
    }

    const { parentId = [] } = req.body;
    const objectIdArr: Types.ObjectId[] = [];
    parentId.forEach((id: Types.ObjectId) => {
      if (id != undefined || id != null) objectIdArr.push(new mongoose.Types.ObjectId(id));
    });

    req.body.parentId = objectIdArr;
    req.body.updatedAt = new Date();

    const result = await Category.updateOne({ _id: id }, req.body);

    if (result.modifiedCount === 0) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "No changes applied");
      return;
    }

    const data = await Category.findOne({
      _id: id,
      deleted: false
    }).select("-__v");

    successResponse(res, data, "Update category successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [POST] api/v1/categories/create
export const create = async (req: Request, res: Response) => {
  try {
    const { parentId = [] } = req.body;
    const objectIdArr: Types.ObjectId[] = [];
    parentId.forEach((id: Types.ObjectId) => {
      if (id != undefined || id != null) objectIdArr.push(new mongoose.Types.ObjectId(id));
    });

    req.body.parentId = objectIdArr;
    req.body.createdAt = new Date();

    const newCate = new Category(req.body);
    const result = await newCate.save();

    const data = result.toObject();
    delete data.__v;

    successResponse(res, data, "Create category successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [DELETE] api/v1/categories/delete/:id
export const deleteCate = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const sortType = req.query.sortType;

    const cate = await Category.findOne({
      _id: id,
      deleted: false
    });

    if (!cate) {
      errorResponse(res, null, httpStatus.NOT_FOUND, "Category not found or already deleted");
      return;
    }

    if (sortType === "sort") {
      await Category.updateOne(
        {
          _id: id
        },
        {
          deleted: true,
          deletedAt: new Date()
        }
      );
    } else {
      await Category.deleteOne({ _id: id });
    }

    successResponse(res, null, "Delete category successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};
