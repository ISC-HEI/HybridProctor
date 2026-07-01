import logger from "@lib/services/logger";
import network from "@lib/services/network";
import { getIp } from "@lib/utils/network";
import { type Request, type Response } from "express";

/**
 * Records a heartbeat from a student, updating their last-seen timestamp.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export async function heartbeatPostHandler(req: Request, res: Response) {
  try {
    const ip = getIp(req);

    if (!ip || ip === "unknown") {
      return res.sendStatus(204);
    }

    await network.recordHeartbeat(ip);

    return res.sendStatus(204);
  } catch (error) {
    logger.error("Heartbeat error");
    return res.sendStatus(204);
  }
}
