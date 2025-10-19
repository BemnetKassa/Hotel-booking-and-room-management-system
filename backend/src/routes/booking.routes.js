import express from "express";
import {
  createBooking,
  getBookings,
  getUserBookings,
  cancelBooking,
} from "../controllers/booking.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protect, getBookings);
router.get("/my-bookings", protect, getUserBookings);
router.post("/", protect, createBooking);
router.delete("/:id", protect, cancelBooking);

export default router;
