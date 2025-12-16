'use server'

import network from "@/lib/services/network";
import db from "@services/db";
import { getIpFromName, nameInDb } from '@services/db/helpers';
import logger from "@services/logger";
import { getIp } from "@utils/network";

export async function isRegistered(name: string) {
  return await nameInDb(name) && await getIp() === await getIpFromName(name);
}

export async function registerStudent(ps: { ok: boolean, message: string, fullname: string }, formData: FormData) {
  const surname = formData.get("surname") as string;
  const name = formData.get("name") as string;
  const fullname = surname + " " + name;

  const ip = await getIp();

  const exists = await nameInDb(fullname);

  if (exists) {
    const originalOwner = db.prepare("SELECT ip FROM students WHERE name = ?;").get(fullname) as {ip: string};
    
    if (ip === originalOwner.ip) {
      return {
        ok: true,
        message: "Student registered successfully",
        fullname,
      };

    }

    const message = "Name already taken by another student!";

    logger.warn(message + ` ${ip} used name ${fullname} whose already in use by ${originalOwner.ip}!`, { issuer: ip, action: "Conflict" });

    return { ok: false, message, fullname }
  }

  const stmt = db.prepare(`
                          INSERT INTO students (name, ip)
                          VALUES (?, ?);
                          `);

  stmt.run(fullname, ip);

  await network.addUpdate(ip, { ip, name: fullname });

  logger.info(`${ip} Registered as ${fullname}.`, { issuer: fullname, action: "Registered" });

  return {
    ok: true,
    message: "Student registered successfully",
    fullname,
  };
}
