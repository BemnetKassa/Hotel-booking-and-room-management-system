import prisma from "../config/prisma.js";
import { io } from "../server.js";

export const getRooms = async (req, res) => {
  const rooms = await prisma.room.findMany();
  res.json(rooms);
};

export const createRoom = async (req, res) => {
  const { name, type, price, status } = req.body;
  const room = await prisma.room.create({ data: { name, type, price, status } });
  res.status(201).json(room);
};

export const updateRoomStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const updated = await prisma.room.update({
    where: { id: Number(id) },
    data: { status },
  });

  // 🔄 Emit real-time room update
  io.emit("room-status-update", updated);

  res.json(updated);
};
