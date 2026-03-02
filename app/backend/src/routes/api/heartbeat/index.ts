import logger from "@lib/services/logger";
import network from "@lib/services/network";
import { getIp } from "@lib/utils/network";
import { type Request, type Response } from "express";

export async function heartbeatPostHandler(req: Request, res: Response) {
  try {
    const ip = await getIp();

    if (!ip) {
      return res.sendStatus(204)
    }

    await network.recordHeartbeat(ip)

    return res.status(204)
  } catch (error) {
    logger.error("Heartbeat error")
    return res.sendStatus(204)
  }
}
