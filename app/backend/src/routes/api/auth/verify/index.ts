
import logger from "@/lib/services/logger";
import storage from "@/lib/services/storage";
import { getIp } from "@/lib/utils/network";
import { type Request, type Response } from "express";

export async function verifyPostHandler(req: Request, res: Response) {
  const ip = await getIp();
  const password = req.body.password;
  const timestamp = req.body.timestamp;

  if (await storage.verifyPassword(password)) {
    const next = req.cookies.desired_url;

    if (!next || !next.value) {
      return res.redirect("/");
    }

    storage.setOffset(timestamp);

    const id = await storage.createSession(ip);

    res.cookie("sid", id, {
      maxAge: 7_200_000,
      httpOnly: true,
      path: '/'
    });

    logger.info(`IP ${ip} logged in as admin.`, { issuer: ip, action: "logged in" });

    return res.redirect(next.value);
  }
  else {
    logger.warn(`IP '${ip}' tried wrong password.`, { issuer: ip, action: "tried" });

    return res.redirect("/");
  }
}
