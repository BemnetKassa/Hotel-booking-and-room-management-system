"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/rooms", label: "Rooms" },
    { href: "/admin/transactions", label: "Transactions" },
  ];

  return (
    <aside className="bg-gray-800 text-gray-200 w-64 min-h-screen p-5 space-y-4">
      <h2 className="text-2xl font-bold mb-8 text-center">Admin Panel</h2>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`block px-3 py-2 rounded-md hover:bg-gray-700 ${
            pathname === link.href ? "bg-gray-700" : ""
          }`}
        >
          {link.label}
        </Link>
      ))}
    </aside>
  );
}
