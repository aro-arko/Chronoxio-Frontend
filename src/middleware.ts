import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "./services/AuthService";

// Define roles & their protected routes
type Role = keyof typeof roleBasedPrivateRoutes;

const authRoutes = ["/login", "/register"];

// Role-based private routes
const roleBasedPrivateRoutes = {
  admin: [/^\/admin/, /^\/admin-profile/, /^\/change-password/],
  user: [/^\/user/, /^\/user-profile/, /^\/change-password/],
};

export const middleware = async (request: NextRequest) => {
  const { pathname, origin } = request.nextUrl;

  const userInfo = await getCurrentUser();

  // not logged in
  if (!userInfo) {
    // Allow access to login/register
    if (authRoutes.includes(pathname)) {
      return NextResponse.next();
    }

    // Redirect unauthenticated users to login with redirect path
    const loginUrl = new URL(`/login?redirectPath=${pathname}`, origin);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in
  const userRole = userInfo.role as Role;

  // Get allowed routes for user’s role
  const allowedRoutes = roleBasedPrivateRoutes[userRole] || [];

  // If current path matches allowed routes → proceed
  if (allowedRoutes.some((route) => route.test(pathname))) {
    return NextResponse.next();
  }

  // 🚫 Fallback: deny access → redirect to home
  return NextResponse.redirect(new URL("/", origin));
};

// Paths the middleware applies to
export const config = {
  matcher: [
    "/login",
    "/register",
    "/admin",
    "/admin/:path*",
    "/admin-profile",
    "/user",
    "/user/:path*",
    "/user-profile",
    "/change-password",
  ],
};
