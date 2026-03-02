
import storage from "@/lib/services/storage";
import { type Request, type Response } from "express";

export async function resourcesPostHandler(req: Request, res: Response) {
  await storage.writeResources(req.files as Express.Multer.File[]);

  return res.sendStatus(200);
}
