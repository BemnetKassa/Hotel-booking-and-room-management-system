// src/routes/payment.routes.js
import express from "express";
import { processPayment, getTransactions } from "../controllers/payment.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public: customers can call to pay (but in production you'd validate callers, possibly via booking token)
router.post("/", processPayment);

// Admin: view transactions
router.get("/", protect, adminOnly, getTransactions);

export default router;
