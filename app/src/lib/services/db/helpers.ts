'use server'

import db from "./";

export async function nameInDb(name: string) {
  return db.prepare("SELECT 1 FROM students WHERE name = ?").get(name);
}

export async function getNameFromIp(ip: string) {
  return (db.prepare("SELECT name FROM students WHERE ip = ?").get(ip) as { name: string }).name;
}

export async function getIpFromName(name: string) {
  return (db.prepare("SELECT ip FROM students WHERE name = ?").get(name) as { ip: string }).ip;
}
