"use client";

import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore"; // adjust path

// Drop this component inside your root layout, inside <body>
export default function AuthHydrator() {
  const hydrate = useAuthStore((s) => s.hydrate);

  useEffect(() => {
    hydrate(); // runs once on app start, restores session from httpOnly cookie
  }, []);

  return null; // renders nothing
}