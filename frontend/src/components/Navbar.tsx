"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/public/dashboard", label: "Home" },
    { href: "/public/room", label: "Rooms" },
    { href: "/public/success", label: "Success" },
    { href: "/public/booking", label: "Book Now" },
    { href: "/admin/dashboard", label: "Admin" },
  ];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          HotelEase
        </Link>
        <div className="flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-medium hover:text-blue-600 ${
                pathname === link.href ? "text-blue-600" : "text-gray-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
