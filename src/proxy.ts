import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/((?!_next|api|service|.*\\..*).*)",
  ],
};

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = req.nextUrl.pathname;

  // 🔥 Read httpOnly cookie
  const token = req.cookies.get("accessToken")?.value;

  const isLoggedIn = !!token;

  // ===============================
  // 🚫 PROTECT PRIVATE ROUTES
  // ===============================
  if (!isLoggedIn && path.startsWith("/lekhan/profile")) {
    url.pathname = "/lekhan";
    return NextResponse.redirect(url);
  }

  // ===============================
  // 🚫 BLOCK LOGIN PAGE FOR LOGGED-IN USERS
  // ===============================
  if (isLoggedIn && path === "/lekhan") {
    url.pathname = "/lekhan/home";
    return NextResponse.redirect(url);
  }

  // ===============================
  // ✅ ALLOW EVERYTHING ELSE
  // ===============================
  return NextResponse.next();
}