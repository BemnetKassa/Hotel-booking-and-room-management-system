"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function AdminRooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/rooms");
      setRooms(res.data);
    } catch (err) {
      toast.error("Failed to load rooms");
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      await api.put(`/rooms/${id}/status`, { status });
      toast.success("Room status updated");
      fetchRooms();
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const updatePrice = async (id: string, price: number) => {
    try {
      await api.put(`/rooms/${id}/price`, { price });
      toast.success("Price updated");
      fetchRooms();
    } catch (err) {
      toast.error("Error updating price");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Manage Rooms</h1>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">#</th>
              <th className="p-3">Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Price</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room: any, index: number) => (
              <tr key={room.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{index + 1}</td>
                <td className="p-3 font-semibold">{room.name}</td>
                <td className="p-3">{room.status}</td>
                <td className="p-3">${room.price}</td>
                <td className="p-3 space-x-2">
                  <select
                    defaultValue={room.status}
                    onChange={(e) => updateStatus(room.id, e.target.value)}
                    className="border rounded-md p-1"
                  >
                    <option>Vacant</option>
                    <option>Occupied</option>
                    <option>Ready for Cleaning</option>
                    <option>Under Maintenance</option>
                  </select>

                  <input
                    type="number"
                    defaultValue={room.price}
                    className="w-20 border rounded-md p-1"
                    onBlur={(e) =>
                      updatePrice(room.id, parseFloat(e.target.value))
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
