import bcrypt from "bcrypt";
import User from "../models/users.model";
import cloudinary from "../configs/cloudinary";

export const getAllUsers = async (
  filter: any,
  pagination: { skip: number; limit: number },
  sort: any
) => {
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort(sort)
    .select("-__v -password -cloudinary_id -favourites");
  return { total, users };
};

export const getUserById = async (id: string, role: string) => {
  let select = "-__v -password -cloudinary_id";
  if (role === "admin") select += " -favourites";
  const user = await User.findOne({ _id: id }).select(select);
  return user;
};

export const createUser = async (data: any, file?: Express.Multer.File) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new Error("Email is existed");
  }

  const defaultPassword = "Abc@12345";
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(defaultPassword, salt);

  data.password = hashPassword;

  if (file) {
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${file.buffer.toString("base64")}`,
      {
        folder: "clothes-management/users",
        resource_type: "image"
      }
    );
    data.avatar = result.secure_url;
    data.cloudinary_id = result.public_id;
  }

  const newUser = new User(data);
  await newUser.save();
  return newUser;
};

export const updateUser = async (id: string, data: any, file?: Express.Multer.File) => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new Error("User not found");
  }

  if (user.cloudinary_id && file) {
    try {
      await cloudinary.uploader.destroy(user.cloudinary_id);
    } catch (err) {
      console.error("Cloudinary destroy error:", err);
    }
  }

  if (file) {
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${file.buffer.toString("base64")}`,
      {
        folder: "clothes-management/users",
        resource_type: "image"
      }
    );
    data.avatar = result.secure_url;
    data.cloudinary_id = result.public_id;
  }

  await User.updateOne({ _id: id }, data);
  return await getUserById(id, data.role || user.role);
};

export const updateProfile = async (
  id: string,
  userEmail: string,
  data: any,
  file?: Express.Multer.File
) => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new Error("User not found");
  }

  if (data.email && data.email !== userEmail) {
    const existed = await User.findOne({ email: data.email });
    if (existed) throw new Error("Email is existed");
  }

  if (user.cloudinary_id && file) {
    try {
      await cloudinary.uploader.destroy(user.cloudinary_id);
    } catch (err) {
      console.error("Cloudinary destroy error:", err);
    }
  }

  if (file) {
    const result = await cloudinary.uploader.upload(
      `data:image/png;base64,${file.buffer.toString("base64")}`,
      {
        folder: "clothes-management/users",
        resource_type: "image"
      }
    );
    data.avatar = result.secure_url;
    data.cloudinary_id = result.public_id;
  }

  await User.updateOne({ _id: id }, data);
  return await getUserById(id, user.role);
};

export const deleteUserById = async (id: string) => {
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new Error("User does not exist");
  }

  if (user.avatar && user.cloudinary_id) {
    try {
      await cloudinary.uploader.destroy(user.cloudinary_id);
    } catch (err) {
      console.error("Cloudinary destroy error:", err);
    }
  }

  await User.deleteOne({ _id: id });
};
