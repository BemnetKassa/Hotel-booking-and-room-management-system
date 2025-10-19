import prisma from '../prismaClient.js';
import bcrypt from 'bcryptjs';

export const createUser = async ({ email, password, name }) => {
  const hashed = await bcrypt.hash(password, 10);
  return prisma.user.create({ data: { email, password: hashed, name } });
};

export const findByEmail = async (email) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findById = async (id) => {
  return prisma.user.findUnique({ where: { id: Number(id) } });
};
