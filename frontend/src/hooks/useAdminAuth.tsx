"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation"

export const useAdminAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const role = localStorage.getItem("adminRole");

    //Rediract if no token or not admin
    if (!token || role !== "admin"){
      router.replace("/admin/login");
    }
  }, [router])
};

