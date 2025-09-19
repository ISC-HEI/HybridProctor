'use server'

import db from "./db";

export async function nameInDb(name: string) {
  return db.prepare("SELECT 1 FROM students WHERE name = ?").get(name);
}
