import { getReq } from "./requestContext";

export async function getIp() {
  const req = getReq();

  if (!req) return "unknown"

  const ipHeader = req.headers["x-forwarded-for"] as string | undefined
  const realIp = req.headers["x-real-ip"] as string | undefined

  const ip = ipHeader?.split(",")[0]?.trim() || realIp || req.socket.remoteAddress || "unknown"
  return ip.replace("::ffff:", "")
}

export async function getUrl(): Promise<string> {
  return process.env.URL || ''
}
