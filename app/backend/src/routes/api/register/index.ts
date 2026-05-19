
import logger from "@/lib/services/logger";
import network from "@/lib/services/network";
import { getIp } from "@/lib/utils/network";
import { type Request, type Response } from "express";

export async function registerPostHandler(req: Request, res: Response) {
  const name = req.body.name;
  
  const student = await network.getStudentByName(name);

  if (!student || getIp(req) !== student.ip) {
    return res.status(200).json({ status: false });
  }

  return res.status(200).json({ status: true });
}

export async function registerPatchHandler(req: Request, res: Response) {
  const { surname, name } = req.body;
  const fullname = surname + ' ' + name;
  
  const ip = getIp(req);
  const student = await network.getStudentByName(fullname);

  if (student) {
    if (ip === student.ip) {
      return res.status(200).json({
        ok: true,
        message: "Student registered successfully",
        fullname,
      });
    }

    const message = "Name already taken by another student!";

    logger.warn(message + ` ${ip} used name ${fullname} whose already in use by ${student.ip}!`, { issuer: ip, action: "Conflict" });

    return res.status(400).json({
      ok: false,
      message,
      fullname
    });
  }

  await network.addUpdate(ip, { ip, name: fullname });

  logger.info(`${ip} Registered as ${fullname}.`, { issuer: fullname, action: "Registered" });

  return res.status(200).json({
    ok: true,
    message: "Student registered successfully",
    fullname,
  });
}
