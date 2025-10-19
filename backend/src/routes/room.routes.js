// src/routes/room.routes.js
import express from "express";
import {
  getRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  updateRoomStatus,
} from "../controllers/room.controller.js";
import { protect } from "../middleware/auth.middleware.js"; // admin protection for create/update/delete

const router = express.Router();

router.get("/", getRooms);           // public: list rooms (customers)
router.get("/:id", getRoomById);    // public: single room
router.post("/", protect, createRoom); // admin
router.put("/:id", protect, updateRoom); // admin
router.delete("/:id", protect, deleteRoom); // admin
router.patch("/:id/status", protect, updateRoomStatus); // admin update status

export default router;
