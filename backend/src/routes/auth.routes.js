import express from "express";
import { register, login, adminLogin } from "../controllers/auth.Controller.js";

const router = express.Router();

// User
router.post("/register", register);
router.post("/login", login);

// Admin
router.post("/admin/login", adminLogin);

export default router;
