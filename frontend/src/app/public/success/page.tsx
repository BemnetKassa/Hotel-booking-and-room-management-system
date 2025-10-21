"use client";

import React from "react";
import Link from "next/link";

const SuccessPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 px-4">
      <h1 className="text-4xl font-semibold text-green-700 mb-3">
        Booking Successful 🎉
      </h1>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Your room has been booked successfully. A confirmation email will be sent to you shortly.
      </p>

      <Link
        href="/public/dashboard"
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Go to Dashboard
      </Link>
    </div>
  );
};

export default SuccessPage;
