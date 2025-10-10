import { NextRequest, NextResponse } from "next/server";
import storage from "./lib/services/storage";
import { cookies } from "next/headers";
import { getIp } from "./lib/utils/network";

const ADMIN_AUTH = "/admin/auth";

export async function middleware(request: NextRequest) {
  const cookiesStore = await cookies();
  const sessionId = cookiesStore.get("sid");

  if ((!sessionId || !sessionId.value || !await storage.verifySession(sessionId.value, await getIp())) && request.nextUrl.pathname !== ADMIN_AUTH) {
    cookiesStore.set("desired_url", request.nextUrl.pathname, {
      httpOnly: true
    });

    return NextResponse.redirect(new URL(ADMIN_AUTH, request.url));
  }
}

export const config = {
  matcher: ['/admin/:path*'],
  runtime: "nodejs"
}
