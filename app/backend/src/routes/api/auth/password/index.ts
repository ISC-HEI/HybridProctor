
import storage from "@/lib/services/storage";
import { type Request, type Response } from "express";

export async function passwordPatchHandler(req: Request, res: Response) {
  storage.newPassword = undefined;
}
