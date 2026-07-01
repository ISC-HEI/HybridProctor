
import logger from "@/lib/services/logger";
import network from "@/lib/services/network";
import sseManager from "@/lib/services/sse";
import storage from "@/lib/services/storage";
import { getIp } from "@/lib/utils/network";
import { type Request, type Response } from "express";

/**
 * Handles student file submissions. Validates the exam is not locked, the student is not
 * already finished, and checks for missing required files before storing.
 * @param req - The Express request object.
 * @param res - The Express response object.
 */
export async function filesPostHandler(req: Request, res: Response) {
  const ip = getIp(req);
  const files = req.files as Express.Multer.File[];

  const student = await network.getStudent(ip);
  const name = student.name;

  if (storage.locked) {
    logger.warn(`tried to upload files while locked`, { issuer: name, action: "upload" })

    return res.status(423).json({
      ok: false,
      message: "The exam hasn't started yet, or has already ended.",
      hash: ""
    });
  }

  if (student.finished) {
    logger.warn(`tried to upload files after end`, { issuer: name, action: "upload" })

    return res.status(423).json({
      ok: false,
      message: "You already validated your latest version.",
      hash: ""
    });
  }

  if (!name || name === '') {
    return res.status(401).json({
      ok: false,
      message: "Please refresh and enter your name.",
      hash: ""
    });
  }

  if (storage.examConfig.studentsFiles.length === 0) {
    logger.info(`${name} finished the exam.`, { issuer: name, action: "Finished" })

    network.addUpdate(ip, { ip, finished: true });
    sseManager.send(ip, { locked: storage.locked, finished: true }, "std", false);

    return res.status(200).json({
      ok: true,
      message: "Exam ended successfully",
      hash: ""
    });
  }

  if (!files || files.length < 1) {
    return res.status(400).json({
      ok: false,
      message: "Please upload at least one file.",
      hash: ""
    });
  }

  const uploadedNames = files.map(f => f.originalname);

  const missing = storage.examConfig.studentsFiles.filter(req => !uploadedNames.includes(req));

  const hash = await storage.writeStudentFiles(ip, files);

  if (hash === "") {
    return res.status(400).json({
      ok: false,
      message: "Not registered",
      hash: ""
    });
  }

  logger.info(`files uploaded by ${name}.`, { issuer: name, action: "Uploaded files" })

  network.addUpdate(ip, { ip, sent: true });

  return res.status(200).json({
    ok: true,
    message: `Files successfully sent. ${missing.length > 0 ? `Missing required files: "${missing.join('", ')}"` : ''}`,
    hash
  });
}
