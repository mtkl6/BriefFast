import { NextResponse, type NextRequest } from "next/server";

// Routes that require API key authentication
const PROTECTED_API_ROUTES = ["/api/briefings"];

// Function to check if a route should be protected
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_API_ROUTES.some((route) => pathname.startsWith(route));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply to API routes that need protection
  if (isProtectedRoute(pathname)) {
    // Get API key from environment (stored securely)
    const apiKey = process.env.API_KEY;

    // API key must be set in environment
    if (!apiKey) {
      console.error("API_KEY not set in environment variables");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    // Check the API key from the request header
    const providedKey = request.headers.get("x-api-key");

    // If reading from a public link (/b/[uuid]), we need to allow without API key
    if (
      pathname.startsWith("/api/briefings") &&
      request.method === "GET" &&
      request.nextUrl.searchParams.has("uuid")
    ) {
      const referer = request.headers.get("referer") || "";
      // Check if the request is coming from a /b/[uuid] page
      if (referer.includes("/b/")) {
        return NextResponse.next();
      }
    }

    // For all other API access, require the API key
    if (!providedKey || providedKey !== apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  // Apply this middleware to API routes only
  matcher: "/api/:path*",
};
