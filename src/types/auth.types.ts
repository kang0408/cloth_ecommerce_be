import { IUserJWT } from "./user.types";

export interface IChangePassword {
  oldPassword: string;
  newPassword: string;
  verifyToken: string;
  user: IUserJWT;
}
