
import { type Request, type Response } from "express";
import storage from "./lib/services/storage";
import { getIp } from "./lib/utils/network";
import logger from "./lib/services/logger";

const ADMIN_AUTH = "/admin/auth";
const NEW_PASSWORD = "/password"; 

export default async function middleware(req: Request, res: Response, next: () => void) {
  const sessionId = req.cookies.sid;

  if (storage.newPassword && req.path !== NEW_PASSWORD) {
    return res.redirect(ADMIN_AUTH);
  }

  if (!storage.newPassword && req.path === NEW_PASSWORD) {
    const ip = await getIp();

    logger.warn(`IP ${ip} tried to access password page.`, { issuer: ip, action: "tried" });

    return res.redirect('/');
  }

  if (
    req.path.startsWith("/admin") && 
    (!sessionId || !await storage.verifySession(sessionId, await getIp()))
    && req.path !== ADMIN_AUTH
  ) {
    res.cookie("desired_url", req.path, {
      httpOnly: true
    });

    return res.redirect(ADMIN_AUTH);
  }

  if (req.path == "/admin") {
    return res.redirect("/admin/monitor");
  }

  next();
}
