const mongoose = require("mongoose");
const { default: httpStatus } = require("http-status");

const Wishlist = require("../models/wishlist.model");

const { successResponse, errorResponse } = require("../helpers/response.helper");

// [GET] api/v1/wishlists
module.exports.getAll = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const list = await Wishlist.findOne({ userId: userId })
      .populate("wishlist", "-__v")
      .select("-__v -userId")
      .exec();

    if (!list) return errorResponse(res, null, httpStatus.BAD_REQUEST, "Wishlists not found");

    return successResponse(res, list, "Get wishlist successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [POST] api/v1/wishlists/add/:id
module.exports.add = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      const objId = new mongoose.Types.ObjectId(userId);
      const newWishlist = new Wishlist({
        userId: objId,
        wishlist: []
      });

      await newWishlist.save();
    }

    const id = req.params;
    const list = await Wishlist.findOne({ userId: userId });

    if (!list) return errorResponse(res, null, httpStatus.BAD_REQUEST, "Wishlists not found");

    if (list.wishlist.includes(new mongoose.Types.ObjectId(id)))
      return errorResponse(res, null, httpStatus.BAD_REQUEST, "Product already in wishlist");

    list.wishlist.push(new mongoose.Types.ObjectId(id));

    await Wishlist.updateOne({ _id: list.id }, { wishlist: list.wishlist });

    return successResponse(res, httpStatus.OK, "Add wishlist successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [DELETE] api/v1/wishlists/remove/:id
module.exports.remove = async (req, res) => {
  try {
    const id = req.params;
    const { id: userId } = req.user;
    const list = await Wishlist.findOne({ userId: userId });

    if (!list) return errorResponse(res, null, httpStatus.BAD_REQUEST, "Wishlists not found");

    if (!list.wishlist.includes(new mongoose.Types.ObjectId(id)))
      return errorResponse(res, null, httpStatus.BAD_REQUEST, "Product not found in wishlist");

    list.wishlist = list.wishlist.filter((item) => !item.equals(new mongoose.Types.ObjectId(id)));

    await list.save();
    return successResponse(res, httpStatus.OK, "Remove wishlist successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

// [DELETE] api/v1/wishlists/clear
module.exports.clear = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const list = await Wishlist.findOne({ userId: userId });

    if (!list) return errorResponse(res, null, httpStatus.BAD_REQUEST, "Wishlists not found");

    await Wishlist.deleteOne({ userId });

    return successResponse(res, httpStatus.OK, "Clear wishlist successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};
