
import storage from "@/lib/services/storage";
import { type Request, type Response } from "express";

/**
 * Clears the "new password" flag after the admin has acknowledged and set a new password.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export async function passwordPatchHandler(req: Request, res: Response) {
  storage.newPassword = undefined;

  return res.sendStatus(200);
}
