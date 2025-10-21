// src/middleware/auth.middleware.js
import { verifyToken } from "../utils/jwt.js";

/**
 * protect - verifies JWT token and attaches user object to req.user
 */
export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    // decoded could be { id, role, iat, exp } depending on signing
    req.user = { id: decoded.id, role: decoded.role ?? decoded.role };
    return next();
  } catch (err) {
    console.error("protect middleware error:", err);
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

/**
 * adminOnly - ensures req.user.role === "admin"
 */
export const adminOnly = (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role !== "admin") return res.status(403).json({ message: "Admin access required" });
  next();
};
