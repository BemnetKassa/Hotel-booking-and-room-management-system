
"use client";


import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import Image from "next/image";

export default function PublicDashboard() {
  const [stats, setStats] = useState({
    totalRooms: 0,
    occupiedRooms: 0,
    vacantRooms: 0,
    totalBookings: 0,
  });

  useEffect(() => {
    api.get("/admin/stats")
      .then(res => setStats(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-10 px-4">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-10 text-center drop-shadow-lg animate-fade-in">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center hover:scale-105 transition-transform duration-300 border-t-4 border-blue-500">
          <div className="flex justify-center mb-3">
            <Image src="/window.svg" alt="Rooms" width={40} height={40} />
          </div>
          <h3 className="text-gray-500 mb-2 text-lg font-semibold">Total Rooms</h3>
          <p className="text-4xl font-extrabold text-blue-600 tracking-wide">{stats.totalRooms}</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl text-center hover:scale-105 transition-transform duration-300 border-t-4 border-red-500">
          <div className="flex justify-center mb-3">
            <Image src="/file.svg" alt="Occupied" width={40} height={40} />
          </div>
          <h3 className="text-gray-500 mb-2 text-lg font-semibold">Occupied</h3>
          <p className="text-4xl font-extrabold text-red-500 tracking-wide">{stats.occupiedRooms}</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl text-center hover:scale-105 transition-transform duration-300 border-t-4 border-green-500">
          <div className="flex justify-center mb-3">
            <Image src="/globe.svg" alt="Vacant" width={40} height={40} />
          </div>
          <h3 className="text-gray-500 mb-2 text-lg font-semibold">Vacant</h3>
          <p className="text-4xl font-extrabold text-green-500 tracking-wide">{stats.vacantRooms}</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl text-center hover:scale-105 transition-transform duration-300 border-t-4 border-yellow-400">
          <div className="flex justify-center mb-3">
            <Image src="/vercel.svg" alt="Bookings" width={40} height={40} />
          </div>
          <h3 className="text-gray-500 mb-2 text-lg font-semibold">Bookings</h3>
          <p className="text-4xl font-extrabold text-yellow-500 tracking-wide">{stats.totalBookings}</p>
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <div className="bg-blue-100 rounded-xl shadow-lg p-6 w-full max-w-xl animate-fade-in">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Welcome to HotelEase!</h2>
          <p className="text-gray-700 text-lg">Enjoy a seamless booking experience and manage your stay with ease. Explore our rooms, book instantly, and chat with our support team for any help. Your comfort is our priority!</p>
        </div>
      </div>
    </div>
  );
}