'use server'

import db from "./";

export async function nameInDb(name: string) {
  const data = db.prepare("SELECT 1 FROM students WHERE name = ?").get(name);

  if (data == undefined) {
    return false;
  }

  return data;
}

export async function getNameFromIp(ip: string) {
  const data = db.prepare("SELECT name FROM students WHERE ip = ?").get(ip);
  
  if (data == undefined) {
    return false;
  }

  return data.name
}

export async function getIpFromName(name: string) {
  const data = db.prepare("SELECT ip FROM students WHERE name = ?").get(name);

  if (data == undefined) {
    return false;
  }

  return data.ip;
}
