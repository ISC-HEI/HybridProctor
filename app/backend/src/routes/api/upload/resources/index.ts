
import storage from "@/lib/services/storage";
import { type Request, type Response } from "express";

/**
 * Replaces all exam resource files with an uploaded set.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export async function resourcesPostHandler(req: Request, res: Response) {
  await storage.writeResources(req.files as Express.Multer.File[]);

  return res.sendStatus(200);
}
