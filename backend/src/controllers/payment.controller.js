import prisma from "../config/prisma.js";

export const processPayment = async (req, res) => {
  const { bookingId, method, amount } = req.body;

  const payment = await prisma.payment.create({
    data: { bookingId, method, amount, status: "Success" },
  });

  res.json({ message: "Payment processed", payment });
};
