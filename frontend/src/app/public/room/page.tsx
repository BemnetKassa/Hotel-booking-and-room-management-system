"use client";

import React from "react";
import Link from "next/link";

const RoomPage = () => {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 relative"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.65), rgba(255,255,255,0.75)), url('/room2.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">Available Rooms</h1>
      <p className="text-gray-600 text-center max-w-md">
        Browse through our available rooms and find the perfect fit for your stay.
        Room management features will be added soon.
      </p>
      <Link href="/public/dashboard" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default RoomPage;
