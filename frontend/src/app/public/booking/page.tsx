"use client";

import React, { useState } from "react";
import Link from "next/link";

// Mock available rooms
const availableRooms = [
  { id: 1, name: "Deluxe King Room", price: 120 },
  { id: 2, name: "Standard Twin Room", price: 90 },
  { id: 3, name: "Family Suite", price: 200 },
];

const BookingPage = () => {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    roomId: availableRooms[0].id,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const selectedRoom = availableRooms.find(r => r.id === Number(form.roomId));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-semibold mb-4 text-center">Book Your Room</h1>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Select Room</label>
              <select
                name="roomId"
                value={form.roomId}
                onChange={handleChange}
                className="w-full border rounded-md p-2"
              >
                {availableRooms.map(room => (
                  <option key={room.id} value={room.id}>{room.name} (${room.price}/night)</option>
                ))}
              </select>
            </div>
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
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              Confirm Booking
            </button>
          </form>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-green-700 mb-2">Booking Preview</h2>
            <div className="bg-green-50 rounded-lg p-4 mb-4 text-left">
              <div><span className="font-medium">Room:</span> {selectedRoom?.name}</div>
              <div><span className="font-medium">Guests:</span> {form.guests}</div>
              <div><span className="font-medium">Check-in:</span> {form.checkIn}</div>
              <div><span className="font-medium">Check-out:</span> {form.checkOut}</div>
              <div><span className="font-medium">Name:</span> {form.fullName}</div>
              <div><span className="font-medium">Phone:</span> {form.phone}</div>
              <div><span className="font-medium">Total Price:</span> ${selectedRoom ? selectedRoom.price * (form.checkIn && form.checkOut ? (new Date(form.checkOut).getDate() - new Date(form.checkIn).getDate() || 1) : 1) : 0}</div>
            </div>
            <p className="mb-4 text-gray-700">This is a preview. In a real app, you would now confirm and pay for your booking.</p>
            <div className="flex flex-col gap-2">
              <Link href="/public/success" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Confirm & Finish</Link>
              <button onClick={() => setSubmitted(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Edit Details</button>
              <Link href="/public/dashboard" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Go to Dashboard</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
