
import logger from "@/lib/services/logger";
import storage from "@/lib/services/storage";
import { getIp } from "@/lib/utils/network";
import { type Request, type Response } from "express";

/**
 * Authenticates an admin by password. On success, sets the clock offset from the client
 * timestamp, creates a session cookie, and redirects to the originally requested URL.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export async function verifyPostHandler(req: Request, res: Response) {
  const ip = getIp(req);
  const password = req.body.password;
  const timestamp = req.body.timestamp;

  if (storage.verifyPassword(password)) {
    const next = req.cookies.desired_url;

    if (!next) {
      return res.json({ redirect: "/" });
    }

    storage.setOffset(timestamp);

    const id = await storage.createSession(ip);

    res.cookie("sid", id, {
      maxAge: 7_200_000,
      httpOnly: true,
      path: '/'
    });

    logger.info(`IP ${ip} logged in as admin.`, { issuer: ip, action: "logged in" });

    return res.json({ redirect: next });

  } else {
    logger.warn(`IP '${ip}' tried wrong password.`, { issuer: ip, action: "tried" });

    return res.json({ redirect: '/' });
  }
}
