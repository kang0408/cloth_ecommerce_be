import { IUserJWT } from "../user.types";

export {};
declare global {
  namespace Express {
    export interface Request {
      user?: IUserJWT;
      files?: Request.Multer.File[];
    }
  }
}
