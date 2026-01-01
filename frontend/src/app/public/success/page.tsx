"use client";

import React, { useEffect } from "react";
import Link from "next/link";

// Simple confetti effect
const Confetti = () => {
  useEffect(() => {
    const canvas = document.getElementById("confetti-canvas") as HTMLCanvasElement;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = window.innerWidth, H = window.innerHeight;
    canvas.width = W; canvas.height = H;
    const confettiCount = 120;
    const confetti: any[] = [];
    for (let i = 0; i < confettiCount; i++) {
      confetti.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 6 + 4,
        d: Math.random() * confettiCount,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`,
        tilt: Math.random() * 10 - 10,
      });
    }
    let angle = 0;
    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < confettiCount; i++) {
        const c = confetti[i];
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2, false);
        ctx.fillStyle = c.color;
        ctx.fill();
      }
      update();
      requestAnimationFrame(draw);
    }
    function update() {
      angle += 0.01;
      for (let i = 0; i < confettiCount; i++) {
        const c = confetti[i];
        c.y += Math.cos(angle + c.d) + 1 + c.r / 2;
        c.x += Math.sin(angle) * 2;
        if (c.x > W + 5 || c.x < -5 || c.y > H) {
          confetti[i] = {
            x: Math.random() * W,
            y: -10,
            r: c.r,
            d: c.d,
            color: c.color,
            tilt: c.tilt,
          };
        }
      }
    }
    draw();
    return () => { ctx?.clearRect(0, 0, W, H); };
  }, []);
  return <canvas id="confetti-canvas" className="fixed inset-0 pointer-events-none z-30" />;
};

// Mock booking summary
const booking = {
  reference: "ABC123456",
  room: "Deluxe King Room",
  guests: 2,
  checkIn: "2026-01-10",
  checkOut: "2026-01-13",
  price: 360,
};

const SuccessPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4 relative overflow-hidden">
      <Confetti />
      <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center max-w-md w-full z-10">
        <h1 className="text-4xl font-semibold text-green-700 mb-3 text-center">
          Booking Successful 🎉
        </h1>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Your room has been booked successfully.<br />A confirmation email will be sent to you shortly.
        </p>
        <div className="w-full bg-green-100 rounded-lg p-4 mb-4">
          <h2 className="text-lg font-bold text-green-800 mb-2">Booking Summary</h2>
          <div className="text-gray-700 text-sm">
            <div><span className="font-medium">Reference:</span> {booking.reference}</div>
            <div><span className="font-medium">Room:</span> {booking.room}</div>
            <div><span className="font-medium">Guests:</span> {booking.guests}</div>
            <div><span className="font-medium">Check-in:</span> {booking.checkIn}</div>
            <div><span className="font-medium">Check-out:</span> {booking.checkOut}</div>
            <div><span className="font-medium">Total Price:</span> ${booking.price}</div>
          </div>
        </div>
        <div className="mb-4 text-gray-700 text-center">
          <p className="mb-1">Please arrive at the hotel front desk with your reference number and a valid ID.</p>
          <p>Check-in starts at 2:00 PM. For any questions, contact our support team.</p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <Link
            href="/public/dashboard"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/public/booking"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-center"
          >
            Make Another Booking
          </Link>
          <Link
            href="/public/booking/details?ref=ABC123456"
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-center"
          >
            View Booking Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
