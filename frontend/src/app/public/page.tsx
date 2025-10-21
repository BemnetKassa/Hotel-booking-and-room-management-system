"use client";

import React from "react";
import Link from "next/link";

const PublicPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white px-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
          Welcome to Our Hotel Booking System 🏨
        </h1>

        <p className="text-gray-600 mb-8">
          Experience comfort, convenience, and luxury. Book your stay with us and
          manage everything online — from room selection to confirmation.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/public/room"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            View Rooms
          </Link>

          <Link
            href="/public/booking"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Book Now
          </Link>

          <Link
            href="/contact"
            className="px-6 py-3 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition"
          >
            Contact Us
          </Link>
        </div>
      </div>

      <footer className="mt-16 text-gray-500 text-sm">
        © {new Date().getFullYear()} Hotel Booking System. All rights reserved.
      </footer>
    </div>
  );
};

export default PublicPage;
