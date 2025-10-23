"use client";

import { Menu } from "lucide-react";

export default function AdminHeader({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-sm">
      <button
        className="md:hidden p-2 rounded hover:bg-gray-100"
        onClick={onMenuClick}
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>
      <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>
    </header>
    
  );
}
