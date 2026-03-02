
import storage from "@/lib/services/storage";
import { type Request, type Response } from "express";

export async function examPostHandler(req: Request, res: Response) {
  await storage.writeExam(req.file!);

  return res.sendStatus(200);
} 
