import type { Request, Response } from "express";

import network from "@/lib/services/network";
import { getIp } from "@/lib/utils/network";

/**
 * Records a student's internet connectivity status report.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export async function reportPostHandler(req: Request, res: Response) {
  const ip = getIp(req);
  const hasInternet = req.body.hasInternet;

  network.addUpdate(ip, { ip, hasInternet })

  return res.sendStatus(200);
}
