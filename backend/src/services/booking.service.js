// src/services/booking.service.js
import prisma from "../config/prisma.js";
import { isRoomAvailable, updateRoomStatus } from "./room.service.js";

/**
 * Create a booking. If roomId provided -> try book that room (check availability).
 * If roomId not provided, function can pick a room (use findAvailableRoom instead outside).
 *
 * bookingData: {
 *   roomId (optional),
 *   customerName,
 *   phoneNumber,
 *   email (optional),
 *   checkInDate,
 *   checkOutDate,
 *   totalAmount
 * }
 */
export const createBooking = async (bookingData) => {
  const {
    roomId,
    customerName,
    phoneNumber,
    email,
    checkInDate,
    checkOutDate,
    totalAmount,
  } = bookingData;

  // validate dates
  const inDate = new Date(checkInDate);
  const outDate = new Date(checkOutDate);
  if (inDate >= outDate) throw new Error("checkOutDate must be after checkInDate");

  let roomToBook = null;

  if (roomId) {
    // verify room exists
    const room = await prisma.room.findUnique({ where: { id: Number(roomId) } });
    if (!room) throw new Error("Room not found");

    const available = await isRoomAvailable(roomId, checkInDate, checkOutDate);
    if (!available) throw new Error("Room is not available for selected dates");

    roomToBook = room;
  } else {
    // caller should call findAvailableRoom to get a room; we include a fallback
    const rooms = await prisma.room.findMany();
    for (const r of rooms) {
      const available = await isRoomAvailable(r.id, checkInDate, checkOutDate);
      if (available) {
        roomToBook = r;
        break;
      }
    }
    if (!roomToBook) throw new Error("No rooms available for selected dates");
  }

  const booking = await prisma.booking.create({
    data: {
      roomId: roomToBook.id,
      customerName,
      phoneNumber,
      email: email ?? null,
      checkInDate: inDate,
      checkOutDate: outDate,
      totalAmount: Number(totalAmount ?? 0),
      status: "Pending",
      paymentStatus: "Unpaid",
    },
  });

  // Optionally mark room as Occupied immediately or wait until check-in/confirmation.
  // We'll update to "Occupied" here if booking overlaps current date.
  const now = new Date();
  if (inDate <= now && outDate > now) {
    await updateRoomStatus(roomToBook.id, "Occupied");
  }

  return booking;
};

export const getBookingById = async (id) => {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },
    include: { room: true },
  });
  return booking;
};

export const getAllBookings = async (filters = {}) => {
  // filters can include status, roomId, date ranges
  const where = {};
  if (filters.status) where.status = filters.status;
  if (filters.roomId) where.roomId = Number(filters.roomId);
  if (filters.from || filters.to) {
    where.AND = [];
    if (filters.from) where.AND.push({ checkInDate: { gte: new Date(filters.from) } });
    if (filters.to) where.AND.push({ checkOutDate: { lte: new Date(filters.to) } });
  }

  const bookings = await prisma.booking.findMany({
    where,
    include: { room: true },
    orderBy: { createdAt: "desc" },
  });
  return bookings;
};

export const getBookingsByRoom = async (roomId) => {
  return await prisma.booking.findMany({
    where: { roomId: Number(roomId) },
    include: { room: true },
    orderBy: { checkInDate: "desc" },
  });
};

/**
 * Cancel booking: marks booking as Cancelled and set room status to Vacant if no other overlapping bookings.
 */
export const cancelBooking = async (id) => {
  const booking = await prisma.booking.findUnique({ where: { id: Number(id) } });
  if (!booking) throw new Error("Booking not found");

  await prisma.booking.update({
    where: { id: Number(id) },
    data: { status: "Cancelled" },
  });

  // Check if room still has other active bookings overlapping now; if none, set to Vacant
  const now = new Date();
  const overlapping = await prisma.booking.findFirst({
    where: {
      roomId: booking.roomId,
      status: { not: "Cancelled" },
      AND: [
        { checkInDate: { lt: now } },
        { checkOutDate: { gt: now } },
      ],
    },
  });

  if (!overlapping) {
    await prisma.room.update({
      where: { id: booking.roomId },
      data: { status: "Vacant" },
    });
  }

  return { success: true };
};

/**
 * Confirm booking: set status to Confirmed and optionally change room status.
 */
export const confirmBooking = async (id) => {
  const booking = await prisma.booking.findUnique({ where: { id: Number(id) } });
  if (!booking) throw new Error("Booking not found");

  await prisma.booking.update({
    where: { id: Number(id) },
    data: { status: "Confirmed" },
  });

  // If booking covers current date -> set room Occupied
  const now = new Date();
  if (booking.checkInDate <= now && booking.checkOutDate > now) {
    await prisma.room.update({
      where: { id: booking.roomId },
      data: { status: "Occupied" },
    });
  }

  return { success: true };
};
