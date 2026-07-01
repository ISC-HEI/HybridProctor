
import logger from "@/lib/services/logger";
import network from "@/lib/services/network";
import sseManager from "@/lib/services/sse";
import storage from "@/lib/services/storage";
import type { Student } from "@/lib/types/student";
import { type Request, type Response } from "express";

/**
 * Toggles the "finished" status of a student, triggered by the admin. Notifies the affected
 * student via SSE.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export async function statusPostHandler(req: Request, res: Response) {
  const student: Student = req.body.student;
  const ip = student.ip;
  const finished = !student.finished;

  network.addUpdate({ ip, finished });

  logger.warn(`Admin changed 'finished' status of ${student.name !== '' ? student.name : `${student.ip} (Unknown name)`}`, { action: "Changed a status", issuer: "Admin" });

  sseManager.send(ip, { locked: storage.locked, finished }, "std", false);

  return res.sendStatus(200);
}
