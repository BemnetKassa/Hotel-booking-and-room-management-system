// src/services/room.service.js
import prisma from "../config/prisma.js";

/**
 * Get rooms optionally filtered (e.g., by status or type).
 * @param {Object} filter - optional filters e.g. { status: 'Vacant' }
 */
export const getAllRooms = async (filter = {}) => {
  const where = {};
  if (filter.status) where.status = filter.status;
  if (filter.type) where.type = filter.type;
  if (filter.minPrice || filter.maxPrice) {
    where.price = {};
    if (filter.minPrice) where.price.gte = Number(filter.minPrice);
    if (filter.maxPrice) where.price.lte = Number(filter.maxPrice);
  }

  const rooms = await prisma.room.findMany({
    where,
    orderBy: { roomNumber: "asc" },
  });
  return rooms;
};

export const getRoomById = async (id) => {
  const room = await prisma.room.findUnique({
    where: { id: Number(id) },
    include: {
      bookings: {
        orderBy: { checkInDate: "desc" },
      },
    },
  });
  return room;
};

export const createRoom = async (data) => {
  const room = await prisma.room.create({
    data: {
      roomNumber: data.roomNumber,
      type: data.type,
      price: Number(data.price),
      status: data.status ?? "Vacant",
      description: data.description ?? null,
    },
  });
  return room;
};

export const updateRoom = async (id, data) => {
  const updateData = {};
  if (data.roomNumber) updateData.roomNumber = data.roomNumber;
  if (data.type) updateData.type = data.type;
  if (typeof data.price !== "undefined") updateData.price = Number(data.price);
  if (data.status) updateData.status = data.status;
  if (data.description !== undefined) updateData.description = data.description;

  const room = await prisma.room.update({
    where: { id: Number(id) },
    data: updateData,
  });
  return room;
};

export const deleteRoom = async (id) => {
  // Optionally: check for future bookings before delete
  await prisma.room.delete({ where: { id: Number(id) } });
  return { success: true };
};

/**
 * Update room status (Vacant, Occupied, Ready for Cleaning, Under Maintenance)
 */
export const updateRoomStatus = async (id, status) => {
  const room = await prisma.room.update({
    where: { id: Number(id) },
    data: { status },
  });
  return room;
};

/**
 * Check availability for a room in a date range:
 * returns true if available (no overlapping confirmed/pending bookings)
 */
export const isRoomAvailable = async (roomId, checkInDate, checkOutDate) => {
  const overlapping = await prisma.booking.findFirst({
    where: {
      roomId: Number(roomId),
      status: { not: "Cancelled" },
      AND: [
        { checkInDate: { lt: new Date(checkOutDate) } },
        { checkOutDate: { gt: new Date(checkInDate) } },
      ],
    },
  });
  return !Boolean(overlapping);
};

/**
 * Find any room that is available for given dates and optional type.
 * Useful for public booking flow where customer picks availability instead of specific room.
 */
export const findAvailableRoom = async (checkInDate, checkOutDate, type = null) => {
  // naive approach: fetch rooms (optionally by type) and test each for availability.
  const rooms = await prisma.room.findMany({
    where: type ? { type } : {},
    orderBy: { price: "asc" },
  });

  for (const r of rooms) {
    const ok = await isRoomAvailable(r.id, checkInDate, checkOutDate);
    if (ok) return r;
  }
  return null;
};
