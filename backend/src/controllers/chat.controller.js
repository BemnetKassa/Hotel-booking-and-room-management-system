import prisma from "../config/prisma.js";

// Get messages in room
export const getMessages = async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    const messages = await prisma.message.findMany({
      where: { roomId },
      include: { sender: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "asc" },
    });
    res.json(messages);
  } catch (error) {
    console.error("getMessages error:", error);
    res.status(500).json({ message: "Failed to load messages" });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { roomId, content, receiverId } = req.body;
    const senderId = req.user?.id;
    if (!senderId) return res.status(401).json({ message: "Not authenticated" });

    const msg = await prisma.message.create({
      data: {
        content,
        roomId: roomId ? Number(roomId) : null,
        sender: { connect: { id: Number(senderId) } },
        receiver: receiverId ? { connect: { id: Number(receiverId) } } : undefined,
      },
      include: { sender: { select: { id: true, name: true, email: true } } },
    });

    // Optionally broadcast via socket.io elsewhere
    res.status(201).json(msg);
  } catch (error) {
    console.error("sendMessage error:", error);
    res.status(500).json({ message: "Failed to send message" });
  }
};
