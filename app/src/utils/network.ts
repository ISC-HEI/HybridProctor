import { headers } from "next/headers";


export async function getIp() {
  const h = await headers()
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    "unknown";
}
