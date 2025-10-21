// src/services/payment.service.js
import prisma from "../config/prisma.js";

/**
 * processPayment - records a transaction and updates booking.paymentStatus.
 * This function is a placeholder integration: replace with real gateway call.
 *
 * input: { bookingId, amount, method, status } // status could be "Completed" or "Failed"
 */
export const processPayment = async ({ bookingId, amount, method }) => {
  // validate booking exists
  const booking = await prisma.booking.findUnique({ where: { id: Number(bookingId) } });
  if (!booking) throw new Error("Booking not found");

  // Create transaction record (initially Pending)
  const transaction = await prisma.transaction.create({
    data: {
      bookingId: booking.id,
      amount: Number(amount),
      method,
      status: "Completed", // assume success for now; change after gateway response
    },
  });

  // Update booking payment status and, if desired, booking status
  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      paymentStatus: "Paid",
      status: booking.status === "Pending" ? "Confirmed" : booking.status,
    },
  });

  // Optionally update room status if check-in is current
  const now = new Date();
  if (booking.checkInDate <= now && booking.checkOutDate > now) {
    await prisma.room.update({
      where: { id: booking.roomId },
      data: { status: "Occupied" },
    });
  }

  // Return transaction with booking include
  const result = await prisma.transaction.findUnique({
    where: { id: transaction.id },
    include: { booking: true },
  });

  return result;
};

export const getAllTransactions = async (filters = {}) => {
  const where = {};
  if (filters.method) where.method = filters.method;
  if (filters.status) where.status = filters.status;
  if (filters.from || filters.to) {
    where.createdAt = {};
    if (filters.from) where.createdAt.gte = new Date(filters.from);
    if (filters.to) where.createdAt.lte = new Date(filters.to);
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { booking: true },
  });

  return transactions;
};
