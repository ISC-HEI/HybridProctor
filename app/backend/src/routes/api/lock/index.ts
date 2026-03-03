
import sseManager from "@/lib/services/sse";
import storage from "@/lib/services/storage";
import { type Request, type Response } from "express";

export async function lockPostHandler(req: Request, res: Response) {
  storage.locked = !storage.locked;

  sseManager.broadcast({ locked: storage.locked }, "std", false);

  return res.sendStatus(200);
}
