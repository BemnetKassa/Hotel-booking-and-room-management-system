import express from "express";
import { getAllUsers, getUserProfile } from "../controllers/user.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getAllUsers);
router.get("/profile", protect, getUserProfile);

export default router;
