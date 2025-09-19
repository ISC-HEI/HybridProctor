'use server'

import db from "@/utils/db";
import { nameInDb } from '@utils/dbHelpers';
import logger from "@/utils/logger";
import { getIp } from "@/utils/network";


export async function registerStudent(ps: { ok: boolean, message: string, name: string }, formData: FormData) {
  const name = formData.get("name") as string;

  const ip = await getIp();

  logger.info(`Got ip ${ip} for name ${name}.`);

  const exists = await nameInDb(name);

  if (exists) {
    const originalOwner = db.prepare("SELECT ip FROM students WHERE name = ?;").get(name) as {ip: string};
    
    if (ip === originalOwner.ip) {
      return {
        ok: true,
        message: "Student registered successfully",
        name,
      };

    }

    const message = "Name already taken by another student!";

    logger.warn(message + `, ${ip} used name ${name} whose already in use by ${originalOwner.ip}!`);

    return { ok: false, message, name }
  }

  const stmt = db.prepare(`
                          INSERT INTO students (name, ip)
                          VALUES (?, ?);
                          `);

  stmt.run(name, ip);

  return {
    ok: true,
    message: "Student registered successfully",
    name,
  };
}
