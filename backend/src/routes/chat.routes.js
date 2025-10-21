import express from "express";
import { getMessages, sendMessage } from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:roomId", protect, getMessages);
router.post("/", protect, sendMessage);

export default router;
