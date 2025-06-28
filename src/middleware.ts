import { NextRequest, NextResponse } from "next/server";

const exceptionPaths = ["/home", "/user"];
const publicPaths    = ["/"];
const protectedRoutes = ["/profile"];

// Only run on “real” pages — skip Next internals, static files, APIs
export const config = {
  matcher: [
    '/((?!_next|api|service|.*\\..*).*)',
  ],
};

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("accessToken")?.value;

  // 1) Always allow Next.js internals, static files, etc.
  // (Handled by the matcher above :contentReference[oaicite:4]{index=4})

  // 2) Exception paths: open to everyone
  if (exceptionPaths.some(p => path.startsWith(p))) {
    return NextResponse.next();
  }

  // 3) Not logged-in & trying to access a protected route → send to /
  const isProtected = protectedRoutes.some(p => path.startsWith(p));
  if (!token && isProtected) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 4) Logged-in & trying to access the public root → send to /home
  if (token && path === "/") {
    url.pathname = "/home";
    return NextResponse.redirect(url);
  }

  // 5) Logged-in & onboarding flow when hitting "/"
  if (token && path === "/") {
    const status = req.cookies.get("onboarding_status")?.value;
    if (status === "otp_verified") {
      url.pathname = "/preferences";
      return NextResponse.redirect(url);
    }
    if (status === "interest_added") {
      url.pathname = "/bio";
      return NextResponse.redirect(url);
    }
    if (status === "profile_completed") {
      url.pathname = "/home";
      return NextResponse.redirect(url);
    }
  }

  // 6) Everything else — allow through
  return NextResponse.next();
}
