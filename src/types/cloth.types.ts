import { Types } from "mongoose";

export interface ICloth {
  title: string;
  description: string;
  price?: number;
  stock?: number;
  thumbnail?: string;
  cloudinary_id?: string;
  status: "active" | "inactive";
  categories: Types.ObjectId[];
  __v?: number;
}
