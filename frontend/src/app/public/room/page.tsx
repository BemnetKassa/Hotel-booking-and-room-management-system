"use client";


import React from "react";
import Link from "next/link";
import RoomCard from "@/components/roomCard";

// Mock data for demonstration
const rooms = [
  {
    id: 1,
    name: "Deluxe King Room",
    description: "Spacious room with a king-size bed, ensuite bathroom, and city view.",
    price: 120,
    imageUrl: "/king size.webp",
    status: "Vacant",
    amenities: ["WiFi", "TV", "Air Conditioning", "Mini Bar", "Balcony"],
    capacity: 2,
    type: "Deluxe",
    reviews: [
      { user: "Alice", rating: 5, comment: "Very comfortable and clean!" },
      { user: "Bob", rating: 4, comment: "Great view and service." },
    ],
  },
  {
    id: 2,
    name: "Standard Twin Room",
    description: "Cozy room with two twin beds, perfect for friends or family.",
    price: 90,
    imageUrl: "/twin bed.webp",
    status: "Occupied",
    amenities: ["WiFi", "TV", "Desk"],
    capacity: 2,
    type: "Standard",
    reviews: [
      { user: "Charlie", rating: 4, comment: "Good value for money." },
    ],
  },
  {
    id: 3,
    name: "Family Suite",
    description: "Large suite with two bedrooms, living area, and kitchenette.",
    price: 200,
    imageUrl: "/room2.webp",
    status: "Vacant",
    amenities: ["WiFi", "TV", "Kitchenette", "Sofa Bed", "Bathtub"],
    capacity: 4,
    type: "Suite",
    reviews: [
      { user: "Dana", rating: 5, comment: "Perfect for our family trip!" },
    ],
  },
];

const RoomPage = () => {
  return (
    <div
      className="min-h-screen px-4 py-8 bg-gray-100"
      style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.65), rgba(255,255,255,0.75)), url('/room2.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4 text-center">Available Rooms</h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">
          Browse through our available rooms and find the perfect fit for your stay. Book instantly and enjoy our top amenities!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div key={room.id} className="flex flex-col">
              <RoomCard room={room} />
              <div className="mt-2 px-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  {room.amenities.map((amenity: string) => (
                    <span key={amenity} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{amenity}</span>
                  ))}
                </div>
                <div className="text-sm text-gray-700 mb-1">Capacity: {room.capacity} | Type: {room.type}</div>
                <div className="mb-2">
                  <span className="font-semibold">Reviews:</span>
                  {room.reviews.length === 0 ? (
                    <span className="ml-2 text-gray-500">No reviews yet</span>
                  ) : (
                    <ul className="ml-2 list-disc list-inside">
                      {room.reviews.map((review, idx) => (
                        <li key={idx} className="text-gray-600">
                          <span className="font-medium">{review.user}</span>: {review.comment} <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/public/dashboard" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomPage;
