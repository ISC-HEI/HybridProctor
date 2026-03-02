import { headers } from "next/headers";

export async function getIp() {
  const h = await headers()
  const ip: string = h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";

  return ip.replace("::ffff:", "");
}

export async function getUrl(): Promise<string> {
  return process.env.URL || ''
}
