
import storage from "@/lib/services/storage";
import type { DirItem } from "@/lib/types/dirItem";
import { type Request, type Response } from "express";

export async function preparePostHandler(req: Request, res: Response) {
  const items: DirItem[] = req.body.items;
  
  return res.status(200).send(await storage.prepareDownload(items));
}
