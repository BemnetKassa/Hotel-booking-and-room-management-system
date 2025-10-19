// src/routes/user.routes.js
import express from "express";
import { registerAdmin, loginAdmin, getUsers, getProfile } from "../controllers/user.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// Admin registration: you may want to disable or protect this endpoint after first use
router.post("/register", registerAdmin);

// Admin login
router.post("/login", loginAdmin);

// Admin-only list users
router.get("/", protect, adminOnly, getUsers);

// Admin profile
router.get("/profile", protect, getProfile);

export default router;
