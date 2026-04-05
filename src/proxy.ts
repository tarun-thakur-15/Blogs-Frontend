import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!_next|api|service|.*\\..*).*)"],
};

export function proxy(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = req.nextUrl.pathname;

  // 🔐 Auth
  const token = req.cookies.get("accessToken")?.value;
  const isLoggedIn = !!token;

  // 🌍 Detect basePath ("" for local, "/lekhan" for prod)
  const basePath = path.startsWith("/lekhan") ? "/lekhan" : "";

  // Normalize path (remove basePath)
  // const normalizedPath = basePath ? path.replace(basePath, "") : path;
  let normalizedPath = path;

if (basePath && path.startsWith(basePath)) {
  normalizedPath = path.slice(basePath.length);
}

// ensure "/" fallback
if (!normalizedPath) normalizedPath = "/";

  // ===============================
  // 🚫 PROTECT PRIVATE ROUTES
  // ===============================
  if (!isLoggedIn && normalizedPath.startsWith("/profile")) {
    url.pathname = `${basePath}`;
    return NextResponse.redirect(url);
  }

  // ===============================
  // 🚫 BLOCK LANDING PAGE FOR LOGGED-IN USERS
  // ===============================
  // if (isLoggedIn && (normalizedPath === "/" || normalizedPath === "")) {
  //   url.pathname = `${basePath}/home`;
  //   return NextResponse.redirect(url);
  // }
  const isLandingPage =
  normalizedPath === "/" ||
  normalizedPath === "" ||
  normalizedPath === undefined;

if (isLoggedIn && isLandingPage) {
  url.pathname = `${basePath}/home`;
  return NextResponse.redirect(url);
}

  // ===============================
  // ✅ ALLOW EVERYTHING ELSE
  // ===============================
  return NextResponse.next();
}