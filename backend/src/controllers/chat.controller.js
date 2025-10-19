import Message from "../models/message.model.js";

// Get messages in room
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).populate("sender");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to load messages" });
  }
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { roomId, text } = req.body;

    const message = await Message.create({
      roomId,
      text,
      sender: req.user.id,
    });

    // Later we’ll broadcast this via socket.io
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
};
