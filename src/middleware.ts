import {NextRequest, NextResponse} from "next/server";
import {ACCESS_TOKEN} from "@/lib/contants";
import {decodeToken} from "@/lib/utils";

export const config = {
  // Apply middleware to all routes except /login, /register/profile, and public routes
  matcher: [
    "/((?!login|register|forgot-password|about-us|explore|_next|api|static|favicon.ico).*)",
  ],
};

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(ACCESS_TOKEN)?.value;
  if (pathname.startsWith("/manager")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const jwtPayload = decodeToken(token);
    const role = jwtPayload?.role;

    if (role !== "Manager") {
      return NextResponse.redirect(new URL("/not-found", request.url));
    }
  }
  return NextResponse.next()
}