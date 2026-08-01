"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

/**
 * Thin client-side wrapper around NextAuth's SessionProvider.
 * Required because layout.tsx is a Server Component but SessionProvider
 * needs to be a Client Component.
 */
export default function NextAuthProvider({ children }: { children: ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
