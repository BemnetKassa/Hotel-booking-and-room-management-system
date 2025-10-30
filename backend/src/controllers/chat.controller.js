// src/controllers/messageController.js
import { supabase } from "../config/supabase.js";

// Get messages in a room
export const getMessages = async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);

    // fetch messages with sender info (join using foreign key)
    const { data: messages, error } = await supabase
      .from("Message")
      .select(`
        id,
        content,
        isRead,
        createdAt,
        updatedAt,
        roomId,
        sender:User!senderId(id, name, email)
      `)
      .eq("roomId", roomId)
      .order("createdAt", { ascending: true });

    if (error) throw error;
    res.json(messages);
  } catch (error) {
    console.error("getMessages error:", error.message);
    res.status(500).json({ message: "Failed to load messages" });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { roomId, content, receiverId } = req.body;
    const senderId = req.user?.id;

    if (!senderId)
      return res.status(401).json({ message: "Not authenticated" });

    const { data: newMessage, error } = await supabase
      .from("Message")
      .insert([
        {
          content,
          roomId: roomId ? Number(roomId) : null,
          senderId: Number(senderId),
          receiverId: receiverId ? Number(receiverId) : null,
        },
      ])
      .select(`
        id,
        content,
        createdAt,
        sender:User!senderId(id, name, email)
      `)
      .single();

    if (error) throw error;

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("sendMessage error:", error.message);
    res.status(500).json({ message: "Failed to send message" });
  }
};
