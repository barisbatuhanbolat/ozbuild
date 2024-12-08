import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware(async (auth, request) => {
  const path = new URL(request.url).pathname;
  
  // Check if the path starts with /dashboard or matches the resume edit pattern
  const isProtectedRoute = 
    path.startsWith('/dashboard') || 
    /^\/my-resume\/[^/]+\/edit/.test(path);

  if (isProtectedRoute) {
    const session = auth().protect();
    if (!session) {
      return NextResponse.redirect(new URL('/sign-in', request.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};