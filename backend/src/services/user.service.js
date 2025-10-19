// src/services/user.service.js
import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import { signToken } from "../utils/jwt.js";

/**
 * createAdmin - create an admin user (for initial setup)
 */
export const createAdmin = async ({ name, email, password }) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Email already in use");

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
      role: "admin",
    },
  });

  const token = signToken({ id: user.id, role: user.role });
  return { user, token };
};

export const loginAdmin = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");

  const token = signToken({ id: user.id, role: user.role });
  return { user, token };
};

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } });
  return users;
};

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({ where: { id: Number(id) }, select: { id: true, name: true, email: true, role: true, createdAt: true } });
  return user;
};
