import Payment from "../models/payment.model.js";

// Process payment
export const processPayment = async (req, res) => {
  try {
    const { bookingId, amount, method } = req.body;

    const payment = await Payment.create({
      booking: bookingId,
      amount,
      method,
      user: req.user.id,
      status: "Completed",
    });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Payment failed" });
  }
};

// Get all payments
export const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().populate("user booking");
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch payments" });
  }
};
