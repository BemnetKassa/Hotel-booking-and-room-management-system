import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { name, email, password: hashed, role } });
    res.status(201).json({ message: "User created", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
