"use client";

import React from "react";
import { AdminAuthProvider } from "@/context/adminAuthContext"; // adjust if needed

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthProvider>{children}</AdminAuthProvider>;
}
