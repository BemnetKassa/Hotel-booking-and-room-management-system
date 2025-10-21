"use client";

import React from "react";
import Link from "next/link";

const BookingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-semibold mb-4">Book Your Room</h1>
      <p className="text-gray-600">Room booking system is under construction.</p>
      <Link href="/public/dashboard" className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
        Go to Dashboard
      </Link>
    </div>
  );
};

export default BookingPage;
