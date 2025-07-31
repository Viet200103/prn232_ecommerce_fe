import {NextRequest, NextResponse} from "next/server";

export const config = {
  // Apply middleware to all routes except /login, /register/profile, and public routes
  matcher: [
    "/((?!login|register|_next|api|static|favicon.ico).*)",
  ],
};

export default function middleware(request: NextRequest) {

  return NextResponse.next()
}
