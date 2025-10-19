// src/controllers/payment.controller.js
import * as paymentService from "../services/payment.service.js";
import { io } from "../server.js"; // ensure server.js exports io

/**
 * Public endpoint — process a payment for a booking
 * body: { bookingId, amount, method }
 */
export const processPayment = async (req, res) => {
  try {
    const { bookingId, amount, method } = req.body;
    if (!bookingId || !amount || !method) return res.status(400).json({ message: "Missing fields" });

    // In production: call payment gateway (CBE/Telebirr/Visa) and verify result before creating transaction
    const transaction = await paymentService.processPayment({ bookingId, amount, method });

    // Emit event for admin dashboards
    io.emit("payment-processed", transaction);

    res.status(201).json({ message: "Payment processed", transaction });
  } catch (err) {
    console.error("processPayment:", err);
    res.status(400).json({ message: err.message });
  }
};

/**
 * Admin endpoint — list transactions
 */
export const getTransactions = async (req, res) => {
  try {
    const filters = {
      method: req.query.method,
      status: req.query.status,
      from: req.query.from,
      to: req.query.to,
    };
    const transactions = await paymentService.getAllTransactions(filters);
    res.json(transactions);
  } catch (err) {
    console.error("getTransactions:", err);
    res.status(500).json({ message: err.message });
  }
};
