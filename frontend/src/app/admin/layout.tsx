"use client";

import { AdminAuthProvider } from "@/context/adminAuthContext";
import "@/styles/admin.css"; // optional, for admin-specific global styles

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthProvider>
      <div className="min-h-screen bg-gray-100 text-gray-900 font-sans">
        {children}
      </div>
    </AdminAuthProvider>
  );
}
