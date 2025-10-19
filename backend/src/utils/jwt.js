// src/utils/jwt.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const signToken = (payload, opts = {}) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: opts.expiresIn || "7d" });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};
