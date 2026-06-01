
import storage from "@/lib/services/storage";
import { unixTime } from "@/lib/utils/time";
import { type Request, type Response } from "express";

export async function timePostHandler(req: Request, res: Response) {
  const timestamp: string = req.body.timestamp;
  storage.setOffset(timestamp)


  return res.json({ time: unixTime() });
}
