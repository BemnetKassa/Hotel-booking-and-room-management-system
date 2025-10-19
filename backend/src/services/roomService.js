import prisma from '../prismaClient.js';

export const createRoom = async (data) => {
  return prisma.room.create({ data });
};

export const getRoom = async (id) => {
  return prisma.room.findUnique({ where: { id: Number(id) } });
};

export const listRooms = async () => {
  return prisma.room.findMany();
};

export const updateRoom = async (id, data) => {
  return prisma.room.update({ where: { id: Number(id) }, data });
};

export const deleteRoom = async (id) => {
  return prisma.room.delete({ where: { id: Number(id) } });
};
