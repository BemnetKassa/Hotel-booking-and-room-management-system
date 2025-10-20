"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";

export default function RoomCard({ room }: any) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all">
      <img src={room.imageUrl} alt={room.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h2 className="font-semibold text-lg">{room.name}</h2>
          <StatusBadge status={room.status} />
        </div>
        <p className="text-gray-500 text-sm mb-2">{room.description}</p>
        <p className="font-semibold text-blue-600 mb-3">${room.price}/night</p>
        <Link
          href={`/booking?room=${room.id}`}
          className="block bg-blue-600 text-white py-2 rounded-lg text-center hover:bg-blue-700"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
