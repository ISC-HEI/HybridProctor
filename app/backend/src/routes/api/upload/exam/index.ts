
import storage from "@/lib/services/storage";
import { type Request, type Response } from "express";

export async function examPostHandler(req: Request, res: Response) {
  console.log(req.file?.size);
  await storage.writeExam(req.file!);

  return res.sendStatus(200);
} 
