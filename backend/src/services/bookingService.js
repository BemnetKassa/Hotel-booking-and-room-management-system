import prisma from '../prismaClient.js';

export const createBooking = async (data) => {
  return prisma.booking.create({ data });
};

export const getBooking = async (id) => {
  return prisma.booking.findUnique({ where: { id: Number(id) } });
};

export const listBookings = async (filter = {}) => {
  return prisma.booking.findMany({ where: filter });
};

export const cancelBooking = async (id) => {
  return prisma.booking.update({ where: { id: Number(id) }, data: { status: 'cancelled' } });
};
