import { NextRequest, NextResponse } from "next/server";
import storage from "./lib/services/storage";
import { cookies } from "next/headers";
import { getIp } from "./lib/utils/network";
import logger from "./lib/services/logger";

const ADMIN_AUTH = "/admin/auth";
const NEW_PASSWORD = "/password";

export async function middleware(request: NextRequest) {
  const cookiesStore = await cookies();
  const sessionId = cookiesStore.get("sid");

  if (storage.newPassword && request.nextUrl.pathname !== NEW_PASSWORD) {
    return NextResponse.redirect(new URL(NEW_PASSWORD, request.url));
  }

  if (!storage.newPassword && request.nextUrl.pathname === NEW_PASSWORD) {
    const ip = await getIp();

    logger.warn(`IP ${ip} tried to access password page.`, { issuer: ip, action: "tried" });

    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    request.nextUrl.pathname.startsWith("/admin") && 
    (!sessionId || !sessionId.value || !await storage.verifySession(sessionId.value, await getIp()))
    && request.nextUrl.pathname !== ADMIN_AUTH
  ) {
    cookiesStore.set("desired_url", request.nextUrl.pathname, {
      httpOnly: true
    });

    return NextResponse.redirect(new URL(ADMIN_AUTH, request.url));
  }
}

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
}
