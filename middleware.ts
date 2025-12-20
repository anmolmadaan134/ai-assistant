import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  const isChatPage = pathname.startsWith("/chat");
  const isHomePage = pathname === "/";

  
  if (!token && isChatPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  
  if (token && isHomePage) {
    return NextResponse.redirect(new URL("/chat", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/chat/:path*"],
};
