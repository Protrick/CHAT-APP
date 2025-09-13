import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/user.js";

dotenv.config();

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    const token =
      authHeader && authHeader.startsWith("Bearer")
        ? authHeader.split(" ")[1]
        : null;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "JWT must be provided" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decodedToken.userId).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

// Optional: For routes like /api/auth/check
export const isAuthenticated = async (req, res) => {
  res.json({ success: true, user: req.user });
};
