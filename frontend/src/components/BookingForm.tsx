"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export default function BookingForm({ roomId }: { roomId: string }) {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/bookings", { ...form, roomId });
      toast.success("Booking confirmed successfully!");
      setForm({
        fullName: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        guests: 1,
      });
    } catch (err) {
      toast.error("Failed to confirm booking!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-lg space-y-4"
    >
      <h2 className="text-xl font-bold mb-3">Book Your Stay</h2>

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={form.fullName}
        onChange={handleChange}
        className="w-full border rounded-md p-2"
        required
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        className="w-full border rounded-md p-2"
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <input
          type="date"
          name="checkIn"
          value={form.checkIn}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
        />
        <input
          type="date"
          name="checkOut"
          value={form.checkOut}
          onChange={handleChange}
          className="w-full border rounded-md p-2"
          required
        />
      </div>

      <input
        type="number"
        name="guests"
        min="1"
        max="5"
        value={form.guests}
        onChange={handleChange}
        className="w-full border rounded-md p-2"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
      >
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
    </form>
  );
}
