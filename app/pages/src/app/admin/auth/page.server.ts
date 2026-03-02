'use server'

import logger from "@/lib/services/logger";
import storage from "@/lib/services/storage";
import { getIp } from "@/lib/utils/network";
import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";

export async function verify(password: string, timestamp: string) {
  const ip = await getIp();

  if (await storage.verifyPassword(password)) {
    const cookiesStore = await cookies();
    const next = cookiesStore.get("desired_url");

    if (!next || !next.value) {
      return permanentRedirect("/")
    }

    storage.setOffset(timestamp);

    const id = await storage.createSession(ip);

    cookiesStore.set("sid", id, {
      maxAge: 7_200_000,
      httpOnly: true,
      path: '/'
    })

    logger.info(`IP ${ip} logged in as admin.`, { issuer: ip, action: "logged in" });

    return permanentRedirect(next.value);
  }
  else {
    logger.warn(`IP '${ip}' tried wrong password.`, { issuer: ip, action: "tried" });

    return permanentRedirect("/");
  }
}
