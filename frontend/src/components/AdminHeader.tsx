"use client";

import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminHeader({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const router = useRouter();

  const handleLogin = () => {
    router.push("/login"); // navigate to your login page
  };

  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-sm">
      <button
        className="md:hidden p-2 rounded hover:bg-gray-100"
        onClick={onMenuClick}
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      <h1 className="text-lg font-semibold text-gray-800">Admin Dashboard</h1>

      <button
        className="ml-auto px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleLogin}
      >
        Login
      </button>
    </header>
  );
}
