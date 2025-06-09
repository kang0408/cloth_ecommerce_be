// services/category.service.ts
import mongoose, { Types } from "mongoose";
import Category from "../models/category.model";
import paginationHandler from "../helpers/pagination.helper";
import sortHandler from "../helpers/sort.helper";

export const getCategoriesService = async (req: any) => {
  const { filter } = req.query;
  const sort = sortHandler(req.query);

  const paginationDefault = { currentPage: 1, limitPage: 5 };
  const pageTotal = await Category.countDocuments({ parentId: { $size: 0 } });
  const paginationObject = paginationHandler(paginationDefault, pageTotal, req.query);

  const cates = await Category.aggregate([
    {
      $lookup: {
        from: "categories",
        let: { categoryId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $in: ["$$categoryId", "$parentId"] }, { $eq: ["$deleted", false] }]
              }
            }
          },
          {
            $project: { __v: 0 }
          }
        ],
        as: "subCategories"
      }
    },
    {
      $match: {
        parentId: { $size: 0 },
        deleted: false,
        ...(filter ? { name: { $regex: filter, $options: "i" } } : {})
      }
    },
    {
      $project: { __v: 0 }
    },
    {
      $sort: Object.keys(sort).length > 0 ? sort : { createdAt: -1 }
    },
    {
      $skip: paginationObject.offset ?? 0
    },
    {
      $limit: paginationObject.limitPage ?? 10
    }
  ]);

  return {
    cates,
    totalCates: pageTotal,
    totalPages: paginationObject.totalPage,
    currentPage: paginationObject.currentPage
  };
};

export const getAllCategoriesService = async () => {
  return await Category.find().select("-__v");
};

export const getCategoryDetailsService = async (id: string) => {
  return await Category.findOne({ _id: id, deleted: false }).select("-__v");
};

export const editCategoryService = async (id: string, data: any) => {
  const cate = await Category.findOne({ _id: id, deleted: false });
  if (!cate) return null;

  const { parentId = [] } = data;
  const objectIdArr: Types.ObjectId[] = [];
  parentId.forEach((pid: Types.ObjectId) => {
    if (pid != undefined || pid != null) objectIdArr.push(new mongoose.Types.ObjectId(pid));
  });

  data.parentId = objectIdArr;
  data.updatedAt = new Date();

  const result = await Category.updateOne({ _id: id }, data);
  if (result.modifiedCount === 0) return null;

  return await Category.findOne({ _id: id, deleted: false }).select("-__v");
};

export const createCategoryService = async (data: any) => {
  const { parentId = [] } = data;
  const objectIdArr: Types.ObjectId[] = [];
  parentId.forEach((pid: Types.ObjectId) => {
    if (pid != undefined || pid != null) objectIdArr.push(new mongoose.Types.ObjectId(pid));
  });

  data.parentId = objectIdArr;
  data.createdAt = new Date();

  const newCate = new Category(data);
  const result = await newCate.save();

  const response = result.toObject();
  delete response.__v;

  return response;
};

export const deleteCategoryService = async (id: string, sortType: string) => {
  const cate = await Category.findOne({ _id: id, deleted: false });
  if (!cate) throw new Error("Category not found or already deleted");

  if (sortType === "sort") {
    await Category.updateOne(
      { _id: id },
      {
        deleted: true,
        deletedAt: new Date()
      }
    );
  } else {
    await Category.deleteOne({ _id: id });
  }
};
