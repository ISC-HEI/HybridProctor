
import storage from "@/lib/services/storage";
import { getIp } from "@/lib/utils/network";
import { type Request, type Response } from "express";

export async function filesPostHandler(req: Request, res: Response) {
  const ip = await getIp();
  
  const hash = await storage.writeStudentFiles(ip, req.files as Express.Multer.File[]);

  if (hash === "") {
    return res.status(400).json({ error: `Not registered` });
  }

  return res.status(200).json({ hash });
}


