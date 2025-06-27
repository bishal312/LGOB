import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    let accessToken = req.cookies.accessToken;

    if (!accessToken) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        accessToken = authHeader.split(" ")[1];
      }
    }

    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No access token provided" });
    }

    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Unauthorized - Access token expired" });
      }
      console.error("JWT verification failed:", error);
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    return res.status(401).json({ message: "Unauthorized - Token error" });
  }
};

export const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied - Admins only" });
  }
};
