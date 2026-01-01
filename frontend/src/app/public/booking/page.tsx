"use client";

import React, { useState } from "react";
import Link from "next/link";

// Mock available rooms
const availableRooms = [
  { id: 1, name: "Deluxe King Room", price: 120, desc: "Spacious room with king-size bed, city view, and modern amenities." },
  { id: 2, name: "Standard Twin Room", price: 90, desc: "Cozy room with two twin beds, perfect for friends or family." },
  { id: 3, name: "Family Suite", price: 200, desc: "Large suite with two bedrooms, living area, and kitchenette." },
];

const steps = ["Select Room", "Enter Details", "Preview & Confirm"];

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

  // Calculate nights
  const nights = form.checkIn && form.checkOut ? Math.max(1, Math.ceil((new Date(form.checkOut).getTime() - new Date(form.checkIn).getTime()) / (1000 * 60 * 60 * 24))) : 1;
  const totalPrice = selectedRoom ? selectedRoom.price * nights : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col">
      {/* Header */}
      <div className="relative h-48 md:h-56 flex items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/room2.webp')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-green-700/60" />
        <h1 className="relative z-10 text-4xl md:text-5xl font-bold text-white drop-shadow-lg text-center">Book Your Stay</h1>
      </div>

      {/* Stepper */}
      <div className="flex justify-center mt-8 mb-4">
        <ol className="flex space-x-8">
          {steps.map((step, idx) => (
            <li key={step} className={`flex items-center text-sm font-semibold ${(!submitted && idx < 2) || (submitted && idx === 2) ? 'text-blue-700' : 'text-gray-400'}`}>
              <span className={`w-6 h-6 flex items-center justify-center rounded-full border-2 ${((!submitted && idx < 2) || (submitted && idx === 2)) ? 'border-blue-700 bg-blue-100' : 'border-gray-300 bg-white'}`}>{idx + 1}</span>
              <span className="ml-2">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Main Card */}
      <div className="flex flex-col items-center flex-1">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl mt-4 mb-8 border border-blue-100">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Room Selection */}
              <div>
                <label className="block mb-2 font-semibold text-blue-800">Select Room</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {availableRooms.map(room => (
                    <label key={room.id} className={`border rounded-lg p-4 cursor-pointer transition-all ${form.roomId == room.id ? 'border-blue-600 bg-blue-50 shadow' : 'border-gray-200 bg-white'}`}>
                      <input
                        type="radio"
                        name="roomId"
                        value={room.id}
                        checked={Number(form.roomId) === room.id}
                        onChange={handleChange}
                        className="mr-2 accent-blue-600"
                      />
                      <span className="font-bold text-blue-900">{room.name}</span>
                      <div className="text-xs text-gray-500 mb-1">{room.desc}</div>
                      <div className="text-blue-700 font-semibold">${room.price}/night</div>
                    </label>
                  ))}
                </div>
              </div>
              {/* Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={form.fullName}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Check-in</label>
                  <input
                    type="date"
                    name="checkIn"
                    value={form.checkIn}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Check-out</label>
                  <input
                    type="date"
                    name="checkOut"
                    value={form.checkOut}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Guests</label>
                  <input
                    type="number"
                    name="guests"
                    min="1"
                    max="5"
                    value={form.guests}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-green-500 text-white py-2 rounded-lg font-semibold text-lg shadow hover:from-blue-700 hover:to-green-600 transition-all"
              >
                Preview Booking
              </button>
            </form>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-green-700 mb-2">Booking Preview</h2>
              <div className="bg-green-50 rounded-lg p-4 mb-4 text-left border border-green-200">
                <div className="mb-2"><span className="font-medium">Room:</span> {selectedRoom?.name}</div>
                <div className="mb-2"><span className="font-medium">Guests:</span> {form.guests}</div>
                <div className="mb-2"><span className="font-medium">Check-in:</span> {form.checkIn}</div>
                <div className="mb-2"><span className="font-medium">Check-out:</span> {form.checkOut}</div>
                <div className="mb-2"><span className="font-medium">Nights:</span> {nights}</div>
                <div className="mb-2"><span className="font-medium">Name:</span> {form.fullName}</div>
                <div className="mb-2"><span className="font-medium">Phone:</span> {form.phone}</div>
                <div className="border-t border-green-200 my-2"></div>
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Price:</span>
                  <span>${totalPrice}</span>
                </div>
              </div>
              <p className="mb-4 text-gray-700">Please review your booking details. In a real app, you would now confirm and pay for your booking.</p>
              <div className="flex flex-col gap-2">
                <Link href="/public/success" className="px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition">Confirm & Finish</Link>
                <button onClick={() => setSubmitted(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">Edit Details</button>
                <Link href="/public/dashboard" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Go to Dashboard</Link>
              </div>
              <div className="mt-6 flex flex-col items-center">
                <span className="inline-flex items-center gap-2 text-green-700 font-medium text-sm"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#22c55e" opacity="0.15"/><path d="M7 13l3 3 7-7" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> Secure & Trusted Booking</span>
                <span className="text-xs text-gray-400 mt-1">Your information is encrypted and safe.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
