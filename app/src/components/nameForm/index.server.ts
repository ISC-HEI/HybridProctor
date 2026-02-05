'use server'

import network from "@/lib/services/network";
import logger from "@services/logger";
import { getIp } from "@utils/network";

export async function isRegistered(name: string) {
  const student = await network.getStudentByName(name);

  return student && await getIp() === student.ip;
}

export async function registerStudent(ps: { ok: boolean, message: string, fullname: string }, formData: FormData) {
  const surname = formData.get("surname") as string;
  const name = formData.get("name") as string;
  const fullname = surname + " " + name;

  const ip = await getIp();

  const student = await network.getStudentByName(fullname);

  if (student) {
    if (ip === student.ip) {
      return {
        ok: true,
        message: "Student registered successfully",
        fullname,
      };

    }

    const message = "Name already taken by another student!";

    logger.warn(message + ` ${ip} used name ${fullname} whose already in use by ${student.ip}!`, { issuer: ip, action: "Conflict" });

    return { ok: false, message, fullname }
  }

  await network.addUpdate(ip, { ip, name: fullname });

  logger.info(`${ip} Registered as ${fullname}.`, { issuer: fullname, action: "Registered" });

  return {
    ok: true,
    message: "Student registered successfully",
    fullname,
  };
}
