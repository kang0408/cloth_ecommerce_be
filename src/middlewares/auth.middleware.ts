import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import { Request, Response, NextFunction } from "express";

import { errorResponse } from "../helpers/response.helper";
import User from "../models/users.model";
import { IUserJWT } from "../types/user.types";

export const auth =
  (roles = ["user"]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        errorResponse(
          res,
          null,
          httpStatus.UNAUTHORIZED,
          "Access Denied. Please login or register account"
        );
        return;
      }

      const tokenParts = token.split(" ");
      if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid token format" });
        return;
      }

      const tokenValue = tokenParts[1];
      const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET || "") as IUserJWT;

      const user = await User.findOne({ _id: decoded.id });
      if (!user) {
        errorResponse(res, null, httpStatus.UNAUTHORIZED, "Please login or register account");
        return;
      }

      if (!roles.includes(decoded.role)) {
        errorResponse(res, null, httpStatus.UNAUTHORIZED, "Access Denied");
        return;
      }

      req.user = decoded;

      next();
    } catch (error) {
      errorResponse(res, error, 403, "Invalid token");
      return;
    }
  };
