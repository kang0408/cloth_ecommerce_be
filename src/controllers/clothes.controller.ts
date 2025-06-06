import mongoose, { Types } from "mongoose";
import httpStatus from "http-status";
import { Request, Response } from "express";

import paginationHandler from "../helpers/pagination.helper";
import sortHandler from "../helpers/sort.helper";

import { successResponse, errorResponse } from "../helpers/response.helper";
import cloudinary from "../configs/cloudinary";

import Cloth from "../models/clothes.model";
import Cate from "../models/category.model";

interface IFind {
  deleted?: boolean;
  title?: object;
}
// [GET] api/v1/clothes
export const clothes = async (req: Request, res: Response) => {
  try {
    const find: IFind = {
      deleted: false
    };
    const { search } = req.query;

    // Search
    if (search) {
      find.title = { $regex: search, $options: "i" };
    }

    // Sort
    const sort = sortHandler(req.query);

    // Pagination
    const paginationDefault = { currentPage: 1, limitPage: 5 };
    const pageTotal = await Cloth.countDocuments(find);
    const paginationObject = paginationHandler(paginationDefault, pageTotal, req.query);

    const clothes = await Cloth.find(find)
      .populate("categories", "_id name")
      .skip(paginationObject.offset ?? 0)
      .limit(paginationObject.limitPage)
      .sort(sort)
      .select("-__v -cloudinary_id");

    successResponse(
      res,
      {
        clothes,
        totalClothes: pageTotal,
        totalPages: paginationObject.totalPage,
        currentPage: paginationObject.currentPage
      },
      "Get all clothes successfully"
    );
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [POST] api/v1/clothes/create
export const create = async (req: Request, res: Response) => {
  try {
    if (req.body.categories) {
      const categories = req.body.categories.split(",");
      const objectIdArr = categories.map((id: Types.ObjectId) => new mongoose.Types.ObjectId(id));

      req.body.categories = objectIdArr;
    }
    req.body.createdAt = new Date();

    let newCloth;
    // checking avatar/files
    if (Array.isArray(req.files) && (req.body.length as number) > 0) {
      // using cloudinary.uploader.upload() to upload image in cloundinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${req.files[0].buffer.toString("base64")}`,
        {
          folder: "clothes-management/clothes",
          resource_type: "image"
        }
      );

      req.body.thumbnail = result.secure_url;
      req.body.cloudinary_id = result.public_id;
    }

    newCloth = new Cloth(req.body);

    const data = await newCloth.save();

    const result = data.toObject();
    delete result.__v;
    delete result.cloudinary_id;

    successResponse(res, result, "Create cloth successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [PATCH] api/v1/clothes/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // Tìm quần áo trước khi cập nhật
    const cloth = await Cloth.findById(id);
    if (!cloth) {
      errorResponse(res, null, httpStatus.NOT_FOUND, "Cloth not found");
      return;
    }

    if (req.body.categories) {
      const categories = req.body.categories.split(",");
      const objectIdArr = categories.map((id: Types.ObjectId) => new mongoose.Types.ObjectId(id));

      req.body.categories = objectIdArr;
    }

    if (cloth.cloudinary_id) await cloudinary.uploader.destroy(cloth.cloudinary_id);

    // checking avatar/files
    if (Array.isArray(req.files) && (req.body.length as number) > 0) {
      // using cloudinary.uploader.upload() to upload image in cloundinary
      const result = await cloudinary.uploader.upload(
        `data:image/png;base64,${req.files[0].buffer.toString("base64")}`,
        {
          folder: "clothes-management/clothes",
          resource_type: "image"
        }
      );
      req.body.thumbnail = result.secure_url;
      req.body.cloudinary_id = result.public_id;
    }

    // Cập nhật quần áo
    const result = await Cloth.updateOne({ _id: id }, req.body);

    // Kiểm tra xem có gì thay đổi không
    if (result.modifiedCount === 0) {
      errorResponse(res, null, httpStatus.BAD_REQUEST, "No changes applied");
      return;
    }

    const data = await Cloth.findById(id).select("-__v -cloudinary_id");

    successResponse(res, data, "Edit cloth successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [DELETE] api/v1/clothes/delete/:id
export const deleteCloth = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const sortType = req.query.sortType;

    const cloth = await Cloth.findOne({
      _id: id,
      deleted: false
    });

    if (!cloth) {
      errorResponse(res, null, httpStatus.NOT_FOUND, "Cloth not found or already deleted");
      return;
    }

    if (sortType === "soft") {
      await Cloth.updateOne(
        { _id: id },
        {
          deleted: true,
          deletedAt: new Date()
        }
      );
    } else {
      if (cloth.thumbnail && cloth.cloudinary_id)
        await cloudinary.uploader.destroy(cloth.cloudinary_id);
      await Cloth.deleteOne({ _id: id });
    }

    successResponse(res, null, "Delete cloth successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [GET] api/v1/clothes/details/:id
export const details = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const cloth = await Cloth.findById(id)
      .populate("categories", "_id name")
      .select("-cloudinary_id");
    if (!cloth) {
      errorResponse(res, null, httpStatus.NOT_FOUND, "Cloth not found");
      return;
    }

    successResponse(res, cloth, "Get details cloth successfully");
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};

// [GET] api/v1/clothes/cate/:id
export const clothesByCate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Sort
    const sort = sortHandler(req.query);

    // Pagination
    const paginationDefault = { currentPage: 1, limitPage: 5 };
    const pageTotal = await Cloth.countDocuments({
      categories: { $in: { _id: id } }
    });
    const paginationObject = paginationHandler(paginationDefault, pageTotal, req.query);

    const cate = await Cate.findOne({ _id: id });
    if (!cate) {
      errorResponse(res, null, httpStatus.NOT_FOUND, "Category not found");
      return;
    }

    const clothes = await Cloth.find({ categories: { $in: [new mongoose.Types.ObjectId(id)] } })
      .skip(paginationObject.offset ?? 0)
      .limit(paginationObject.limitPage)
      .sort(sort)
      .select("-__v -cloudinary_id");

    successResponse(
      res,
      {
        clothes,
        totalPages: paginationObject.totalPage,
        currentPage: paginationObject.currentPage
      },
      "Get all clothes successfully"
    );
    return;
  } catch (error) {
    errorResponse(res, error);
    return;
  }
};
