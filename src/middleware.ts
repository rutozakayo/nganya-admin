import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const path = nextUrl.pathname;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as { role?: string } | undefined)?.role;

  if (path === "/login" || path === "/post-login") return NextResponse.next();

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (path.startsWith("/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/post-login", nextUrl));
  }

  if (path.startsWith("/owner") && role !== "owner" && role !== "admin") {
    return NextResponse.redirect(new URL("/post-login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json|sw.js|offline.html).*)"],
};
