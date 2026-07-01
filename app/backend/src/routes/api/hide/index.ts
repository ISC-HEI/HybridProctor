
import network from "@/lib/services/network";
import logger from "@/lib/services/logger";
import type { Student } from "@/lib/types/student";
import { type Request, type Response } from "express";

/**
 * Toggles the "hidden" visibility status of a student, triggered by the admin.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export async function hidePostHandler(req: Request, res: Response) {
  const student: Student = req.body.student;
  const ip = student.ip;
  const hidden = !student.hidden;

  network.addUpdate(ip, { ip, hidden });

  logger.warn(`Admin changed 'hidden' status of ${student.name !== '' ? student.name : `${student.ip} (Unknown name)`}`, { action: "Changed a status", issuer: "Admin" });

  return res.sendStatus(200);
}
