"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export default function AdminDashboard() {
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
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>

      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-gray-500 mb-2">Total Rooms</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalRooms}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-gray-500 mb-2">Occupied</h3>
          <p className="text-3xl font-bold text-red-500">{stats.occupiedRooms}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-gray-500 mb-2">Vacant</h3>
          <p className="text-3xl font-bold text-green-500">{stats.vacantRooms}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-gray-500 mb-2">Bookings</h3>
          <p className="text-3xl font-bold text-yellow-500">{stats.totalBookings}</p>
        </div>
      </div>
    </div>
  );
}
