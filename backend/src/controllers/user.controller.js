// src/controllers/user.controller.js
import * as userService from "../services/user.service.js";

/**
 * Admin registration endpoint (use once or protect it)
 * body: { name, email, password }
 */
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const result = await userService.createAdmin({ name, email, password });
    res.status(201).json({ message: "Admin created", user: result.user, token: result.token });
  } catch (err) {
    console.error("registerAdmin:", err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * Admin login
 * body: { email, password }
 */
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginAdmin({ email, password });
    res.json({ message: "Login successful", user: result.user, token: result.token });
  } catch (err) {
    console.error("loginAdmin:", err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * Admin-only list users
 */
export const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    console.error("getUsers:", err);
    res.status(500).json({ message: err.message });
  }
};

/**
 * Profile endpoint for current admin
 */
export const getProfile = async (req, res) => {
  try {
    const id = req.user?.id;
    if (!id) return res.status(401).json({ message: "Not authenticated" });
    const user = await userService.getUserById(id);
    res.json(user);
  } catch (err) {
    console.error("getProfile:", err);
    res.status(500).json({ message: err.message });
  }
};
