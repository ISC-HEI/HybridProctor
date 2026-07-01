
import storage from "@/lib/services/storage";
import { unixTime } from "@/lib/utils/time";
import { type Request, type Response } from "express";

/**
 * Synchronizes the server clock offset using a timestamp provided by the client.
 * Returns the current adjusted server time.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export async function timePostHandler(req: Request, res: Response) {
  const timestamp: string = req.body.timestamp;
  storage.setOffset(timestamp)

  return res.json({ time: unixTime() });
}
