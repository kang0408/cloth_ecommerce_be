// src/services/clothes.service.ts
import mongoose, { Types } from "mongoose";
import httpStatus from "http-status";
import cloudinary from "../configs/cloudinary";

import paginationHandler from "../helpers/pagination.helper";
import sortHandler from "../helpers/sort.helper";

import Cloth from "../models/clothes.model";
import Cate from "../models/category.model";

import { Request } from "express";

interface IFind {
  deleted?: boolean;
  title?: object;
}

export const getAllClothesService = async (req: Request) => {
  const find: IFind = { deleted: false };
  const { search } = req.query;

  if (search) {
    find.title = { $regex: search, $options: "i" };
  }

  const sort = sortHandler(req.query);
  const paginationDefault = { currentPage: 1, limitPage: 5 };
  const pageTotal = await Cloth.countDocuments(find);
  const paginationObject = paginationHandler(paginationDefault, pageTotal, req.query);

  const clothes = await Cloth.find(find)
    .populate("categories", "_id name")
    .skip(paginationObject.offset ?? 0)
    .limit(paginationObject.limitPage)
    .sort(sort)
    .select("-__v -cloudinary_id");

  return {
    clothes,
    totalClothes: pageTotal,
    totalPages: paginationObject.totalPage,
    currentPage: paginationObject.currentPage
  };
};

export const createClothService = async (req: Request) => {
  if (req.body.categories) {
    const categories = req.body.categories.split(",");
    const objectIdArr = categories.map((id: Types.ObjectId) => new mongoose.Types.ObjectId(id));
    req.body.categories = objectIdArr;
  }

  req.body.createdAt = new Date();

  if (Array.isArray(req.files) && (req.body.length as number) > 0) {
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

  const newCloth = new Cloth(req.body);
  const data = await newCloth.save();
  const result = data.toObject();
  delete result.__v;
  delete result.cloudinary_id;
  return result;
};

export const editClothService = async (req: Request) => {
  const id = req.params.id;
  const cloth = await Cloth.findById(id);
  if (!cloth) throw { status: httpStatus.NOT_FOUND, message: "Cloth not found" };

  if (req.body.categories) {
    const categories = req.body.categories.split(",");
    const objectIdArr = categories.map((id: Types.ObjectId) => new mongoose.Types.ObjectId(id));
    req.body.categories = objectIdArr;
  }

  if (cloth.cloudinary_id) await cloudinary.uploader.destroy(cloth.cloudinary_id);

  if (Array.isArray(req.files) && (req.body.length as number) > 0) {
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

  const result = await Cloth.updateOne({ _id: id }, req.body);
  if (result.modifiedCount === 0)
    throw { status: httpStatus.BAD_REQUEST, message: "No changes applied" };

  return await Cloth.findById(id).select("-__v -cloudinary_id");
};

export const deleteClothService = async (req: Request) => {
  const id = req.params.id;
  const sortType = req.query.sortType;

  const cloth = await Cloth.findOne({ _id: id, deleted: false });
  if (!cloth) throw { status: httpStatus.NOT_FOUND, message: "Cloth not found or already deleted" };

  if (sortType === "soft") {
    await Cloth.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() });
  } else {
    if (cloth.thumbnail && cloth.cloudinary_id)
      await cloudinary.uploader.destroy(cloth.cloudinary_id);
    await Cloth.deleteOne({ _id: id });
  }
};

export const getClothDetailsService = async (req: Request) => {
  const id = req.params.id;
  const cloth = await Cloth.findById(id)
    .populate("categories", "_id name")
    .select("-cloudinary_id");
  if (!cloth) throw { status: httpStatus.NOT_FOUND, message: "Cloth not found" };
  return cloth;
};

export const getClothesByCategoryService = async (req: Request) => {
  const { id } = req.params;
  const sort = sortHandler(req.query);
  const paginationDefault = { currentPage: 1, limitPage: 5 };

  const cate = await Cate.findOne({ _id: id });
  if (!cate) throw { status: httpStatus.NOT_FOUND, message: "Category not found" };

  const pageTotal = await Cloth.countDocuments({
    categories: { $in: [new mongoose.Types.ObjectId(id)] }
  });
  const paginationObject = paginationHandler(paginationDefault, pageTotal, req.query);

  const clothes = await Cloth.find({ categories: { $in: [new mongoose.Types.ObjectId(id)] } })
    .skip(paginationObject.offset ?? 0)
    .limit(paginationObject.limitPage)
    .sort(sort)
    .select("-__v -cloudinary_id");

  return {
    clothes,
    totalPages: paginationObject.totalPage,
    currentPage: paginationObject.currentPage
  };
};
