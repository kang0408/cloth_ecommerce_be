import mongoose, { Document } from "mongoose";

import { IUser } from "../types/user.types";

interface IUserDocument extends IUser, Document {}

const userSchema = new mongoose.Schema<IUserDocument>(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    google_id: String,
    password: {
      type: String,
      required: function () {
        return !this.google_id;
      }
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    avatar: String,
    cloudinary_id: String
  },
  {
    timestamps: true
  }
);

const User = mongoose.model<IUserDocument>("User", userSchema, "users");

export default User;
