
import sseManager from "@/lib/services/sse";
import storage from "@/lib/services/storage";
import { type Request, type Response } from "express";

/**
 * Toggles the exam lock state and notifies all students via SSE.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export async function lockPostHandler(req: Request, res: Response) {
  storage.locked = !storage.locked;

  sseManager.broadcast({ locked: storage.locked }, "std", false);

  return res.sendStatus(200);
}
