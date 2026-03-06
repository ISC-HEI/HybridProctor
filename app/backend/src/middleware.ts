
import { type Request, type Response } from "express";
import storage from "./lib/services/storage";
import { getIp } from "./lib/utils/network";
import logger from "./lib/services/logger";

const ADMIN_AUTH = "/admin/auth";
const NEW_PASSWORD = "/password"; 

export default async function middleware(req: Request, res: Response, next: () => void) {
  const path = req.path;

  const isAsset = path.startsWith("/_next/") || path === "/favicon.ico";
  if (isAsset) {
    return next();
  }

  const sessionId = req.cookies.sid;

  if (storage.newPassword && path !== NEW_PASSWORD) {
    return res.redirect(NEW_PASSWORD);
  }

  if (!storage.newPassword && path === NEW_PASSWORD) {
    const ip = await getIp();

    logger.warn(`IP ${ip} tried to access password page.`, { issuer: ip, action: "tried" });

    return res.redirect("/");
  }

  if (
    path.startsWith("/admin") && 
    (!sessionId || !await storage.verifySession(sessionId, await getIp()))
    && path !== ADMIN_AUTH
  ) {
    res.cookie("desired_url", path, {
      httpOnly: true
    });

    return res.redirect(ADMIN_AUTH);
  }

  console.log(path)

  if (path === "/admin") {
    return res.redirect("/admin/monitor");
  }

  next();
}
