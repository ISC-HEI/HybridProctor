
import storage from "@/lib/services/storage";
import { type Request, type Response } from "express";

/**
 * Uploads a new exam HTML file, replacing the previous one.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export async function examPostHandler(req: Request, res: Response) {
  await storage.writeExam(req.file!);

  return res.sendStatus(200);
} 
