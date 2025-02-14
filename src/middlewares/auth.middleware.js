const jwt = require("jsonwebtoken");

const { errorResponse } = require("../helpers/response.helper");

module.exports.auth = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).json({ message: "Access Denied. No Token Provided!" });
  try {
    const tokenValue = token.split(" ")[1];

    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return errorResponse(res, error, 403, "Invalid token");
  }
};
