"use client";

import { AdminAuthProvider } from "@/context/adminAuthContext";


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
