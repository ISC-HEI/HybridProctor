'use server'

import logger from "@/lib/services/logger";
import storage from "@/lib/services/storage";
import { getIp } from "@/lib/utils/network";
import { cookies } from "next/headers";
import { permanentRedirect } from "next/navigation";

export async function verify(formData: FormData) {
  const password = formData.get("password") as string;
  const ip = await getIp();

  if (await storage.verifyPassword(password)) {
    const cookiesStore = await cookies();
    const next = cookiesStore.get("desired_url");

    if (!next || !next.value) {
      permanentRedirect("/")
    }

    const id = storage.createSession(ip);

    cookiesStore.set("sid", id, {
      maxAge: 7_200_000,
      httpOnly: true,
      path: '/admin'
    })

    permanentRedirect(next.value);
  }
  else {
    logger.warn(`IP '${ip}' tried wrong password.`, { issuer: ip, action: "tried" });

    permanentRedirect("/");
  }
}
