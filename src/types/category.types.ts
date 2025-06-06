import { Types } from "mongoose";

export interface ICategory {
  name: string;
  description: string;
  status: string;
  parentId: Types.ObjectId[];
  __v?: number;
}
