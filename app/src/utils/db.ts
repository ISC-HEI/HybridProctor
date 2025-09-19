import Database from "better-sqlite3";
import logger from "./logger";

const DB_FILE = "src/resources/db/students.db";

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
