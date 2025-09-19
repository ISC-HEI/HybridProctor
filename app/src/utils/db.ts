import Database from "better-sqlite3";
import logger from "./logger";
import { existsSync } from "fs";
import fs from 'fs/promises';
import path from 'path';

const DB_DIR = "src/resources/db";
const DB_FILE = path.join(DB_DIR, "students.db");

if (!existsSync(DB_FILE)) {
  if (!existsSync(DB_DIR)) {
    await fs.mkdir(DB_DIR, { recursive: true });
  }

  await fs.writeFile(DB_FILE, "");
}

const db = new Database(DB_FILE);

db.pragma("journal_mode = WAL");
db.pragma("synchronous = NORMAL");
db.pragma("busy_timeout = 5000");

db.exec(`
        CREATE TABLE IF NOT EXISTS students (
          name TEXT PRIMARY KEY,
          ip TEXT
        );
        `);

logger.debug("Initiated database.");

export default db;

export function clearDb() {
  db.exec("DELETE FROM students;");
  logger.debug("Deleted mapping in database.");
}

clearDb();
