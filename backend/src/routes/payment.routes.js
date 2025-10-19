import express from "express";
import { processPayment, getPayments } from "../controllers/payment.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", protect, processPayment);
router.get("/", protect, getPayments);

export default router;
