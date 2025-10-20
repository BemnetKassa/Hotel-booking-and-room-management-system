"use client";

import RoomCard from "@/components/roomCard";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function HomePage() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.get("/rooms")
      .then(res => setRooms(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Available Rooms</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {rooms.map((room: any) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>
    </div>
  );
}
