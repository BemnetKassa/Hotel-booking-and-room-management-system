import prisma from "../config/prisma.js";

export const createBooking = async (req, res) => {
  const { userId, roomId, startDate, endDate, totalPrice } = req.body;

  const booking = await prisma.booking.create({
    data: { userId, roomId, startDate: new Date(startDate), endDate: new Date(endDate), totalPrice },
  });

  await prisma.room.update({
    where: { id: roomId },
    data: { status: "Occupied" },
  });

  res.status(201).json({ message: "Booking successful", booking });
};
