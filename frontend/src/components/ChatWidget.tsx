"use client";

import { useEffect, useState } from "react";
import socket from "@/lib/socket";

export default function ChatWidget() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("chat_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat_message");
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("chat_message", input);
    setInput("");
  };

  return (
    <div className="fixed bottom-6 right-6 bg-white shadow-xl rounded-2xl p-4 w-72">
      <h3 className="text-lg font-bold text-blue-600 mb-3">Live Chat</h3>
      <div className="h-40 overflow-y-auto border p-2 rounded-md mb-2 text-sm">
        {messages.map((msg, i) => (
          <p key={i} className="my-1">
            💬 {msg}
          </p>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="border flex-grow p-2 rounded-md"
          placeholder="Type message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-3 rounded-md hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
