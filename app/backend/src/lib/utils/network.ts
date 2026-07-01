import { type Request } from "express";

/**
 * Extracts the real client IP address from request headers, respecting proxies
 * via `x-forwarded-for` and `x-real-ip`.
 * @param req - The Express request object.
 * @returns The client IP string.
 */
export function getIp(req: Request) {
  if (!req) return "unknown";

  const ipHeader = req.headers["x-forwarded-for"] as string | undefined
  const realIp = req.headers["x-real-ip"] as string | undefined

  const ip = ipHeader?.split(",")[0]?.trim() || realIp || req.socket.remoteAddress || "unknown"
  return ip.replace("::ffff:", "")
}

/**
 * Returns the server's public URL from the URL environment variable.
 * @returns The server URL, or an empty string.
 */
export async function getUrl(): Promise<string> {
  return process.env.URL || ''
}
