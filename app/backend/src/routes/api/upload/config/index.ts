
import storage from "@/lib/services/storage";
import type { Yamlconf } from "@/lib/types/yamlconf";
import { type Request, type Response } from "express";

/**
 * Updates the exam YAML configuration.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export async function configPostHandler(req: Request, res: Response) {
  const config: Yamlconf = req.body.config;
  
  await storage.writeConfig(config);

  return res.sendStatus(200);
}
