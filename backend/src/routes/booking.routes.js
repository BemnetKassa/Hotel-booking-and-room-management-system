// src/routes/booking.routes.js
import express from "express";
import {
  createBooking,
  getBookings,
  cancelBooking,
  confirmBooking,
  getUserBookings,
} from "../controllers/booking.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public booking endpoint (no auth) — customers can create booking
router.post("/", createBooking);

// Admin endpoints
router.get("/", protect, getBookings); // get all bookings (admin)
router.get("/my-bookings", protect, getUserBookings); // admin or user based on implementation
router.patch("/:id/cancel", protect, cancelBooking);
router.patch("/:id/confirm", protect, confirmBooking);

export default router;
