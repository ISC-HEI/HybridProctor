
import logger from "@/lib/services/logger";
import network from "@/lib/services/network";
import sseManager from "@/lib/services/sse";
import storage from "@/lib/services/storage";
import { getIp } from "@/lib/utils/network";
import { type Request, type Response } from "express";

export async function hashPostHandler(req: Request, res: Response) {
  const ip = getIp(req);
  
  const hash = req.body.hash;

  const student = await network.getStudent(ip);

  if (hash !== student.latestVersion.hash) {
    return res.status(400).json({
      ok: false,
      message: "This hash isn't the latest one."
    });
  }

  if (!storage.validateAndEnd(ip)) {
    return res.status(400).json({
      ok: false,
      message: "Error validating hash."
    });
  }

  network.addUpdate(ip, { ip, finished: true });

  sseManager.send(ip, { locked: storage.locked, finished: true }, "std", false);
  logger.info(`Student ${student.name} finished`, { action: "Finished", issuer: student.name })

  return res.status(200).json({
    ok: true,
    message: "Successfully validated hash and finished exam."
  });
}
