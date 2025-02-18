const jwt = require("jsonwebtoken");
const { default: httpStatus } = require("http-status");

const User = require("../models/users.model");

const { errorResponse } = require("../helpers/response.helper");

module.exports.auth =
  (roles = ["user"]) =>
  async (req, res, next) => {
    try {
      const token = req.headers.authorization;
      if (!token)
        return errorResponse(
          res,
          null,
          httpStatus.BAD_REQUEST,
          "Access Denied. Please login or register account"
        );

      const tokenParts = token.split(" ");
      if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid token format" });
      }

      const tokenValue = tokenParts[1];
      const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

      const user = await User.findOne({ _id: decoded.id });
      if (!user)
        return errorResponse(res, null, httpStatus.BAD_REQUEST, "Please login or register account");

      if (!roles.includes(decoded.role))
        return errorResponse(res, null, httpStatus.BAD_REQUEST, "Access Denied");

      req.user = decoded;

      next();
    } catch (error) {
      return errorResponse(res, error, 403, "Invalid token");
    }
  };
