"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarProps {
  onClose?: () => void;
}

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/rooms", label: "Rooms" },
    { href: "/admin/transactions", label: "Transactions" },
  ];

  return (
    <aside className="bg-gray-800 text-gray-200 w-64 min-h-screen p-5 space-y-4 relative">
      {/* Close button only on mobile */}
      {onClose && (
        <button
          className="md:hidden absolute top-2 right-2 p-2 text-gray-200 hover:bg-gray-700 rounded"
          onClick={onClose}
        >
          ✕
        </button>
      )}

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
