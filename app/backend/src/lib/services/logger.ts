
import fs from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import dayjs, { type Dayjs } from "dayjs";
import "dayjs/locale/fr-ch.js";
import firstline from "firstline";
import sseManager from "@/lib/services/sse";
import Mutex from "../utils/mutex";
import { v4 as uuidv4 } from "uuid";
import { getTime } from "../utils/time";
import { type LogRecord, type LogType } from "../types/logger";

dayjs.locale("fr-ch");

const LATEST_LOG_NAME = "latest.log";
const DEFAULT_LOG_PATH = "/mount_point/logs";

interface LogRecordOpts {
  issuer?: string;
  action?: string;
}

class Logger {
  private logLevel: "default"|"debug";
  private logPath: string;
  private logFilePath: string;
  private initialized: boolean = false;
  private logs: LogRecord[] = [];
  private logsMutex = new Mutex();

  /**
   * Reads LOG_PATH and LOG_LEVEL from environment variables.
   */
  constructor() {
    if ((!process.env.LOG_LEVEL || !process.env.LOG_PATH) && (process.env.LOG_LEVEL !== "default" && process.env.LOG_LEVEL !== "debug")) {
      throw new Error(".env is not configured correctly!!!");
    }

    this.logLevel = process.env.LOG_LEVEL as "default"|"debug";
    this.logPath = process.env.LOG_PATH !== "default" ? process.env.LOG_PATH as string : DEFAULT_LOG_PATH;
    this.logFilePath = join(this.logPath, LATEST_LOG_NAME);
  }

  /**
   * Returns whether the logger has been initialized.
   * @returns The initialization state.
   */
  public isInitialized(){
    return this.initialized;
  }

  /**
   * Creates the log directory and file. If a previous log file exists, it is archived.
   */
  public async init() {
    if (this.initialized) throw Error("Logger already initiated!");

    this.initialized = true;

    if (!existsSync(this.logPath)) {
      await fs.mkdir(this.logPath, { recursive: true });
    }

    if (existsSync(this.logFilePath)) {
      await this.renameLatest()
    }

    fs.writeFile(this.logFilePath, "");
  }

  /**
   * Archives the previous log file by renaming it with a timestamp derived from its first line.
   * If the file is empty, it is removed instead.
   */
  private async renameLatest() {
    const fl = await firstline(this.logFilePath);

    if (!fl || fl === "") {
      await fs.rm(this.logFilePath);
      return;
    }

    const newName = `${fl.substring(4, 28).replace(".", "").replace(/[ :]/gi, "_")}.log`;

    await fs.rename(this.logFilePath, join(this.logPath, newName));
  }

  /**
   * Formats a Dayjs timestamp for use in log output lines.
   * @param timestamp - The timestamp to format.
   * @returns The formatted time string.
   */
  private getFormatedTime(timestamp: Dayjs) {
    return timestamp.format(`ddd DD-MM-YYYY HH:mm:ss${this.logLevel === "debug" ? ":SSS" : ""} +01:00 (CET)`);
  }

  /**
   * Constructs a structured LogRecord with a UUID, timestamp, type, and optional metadata.
   * @param type - The severity/type of the log entry.
   * @param message - The log message.
   * @param [opts] - Optional issuer and action metadata.
   * @returns The constructed log record.
   */
  private async buildRecord(type: LogType, message: string, opts?: LogRecordOpts): Promise<LogRecord> {
    const timestamp = getTime();
    const uuid = uuidv4();

    return {
      uuid,
      type,
      timestamp: timestamp.toISOString(),
      message,
      issuer: opts?.issuer,
      action: opts?.action,
    }
  }

  /**
   * Appends a log record to the file, keeps an in-memory buffer of the last 500 records,
   * and broadcasts the record to admin SSE clients.
   * @param record - The log record to persist and broadcast.
   */
  private async writeRecord(record: LogRecord) {
    const formatedTime = this.getFormatedTime(dayjs(record.timestamp));
    const raw = `[${ record.type[0]?.toUpperCase() }] ${formatedTime} | ${record.message}`;
    const unlock = await this.logsMutex.lock();
    await fs.appendFile(this.logFilePath, raw + '\n', "utf8");
    this.logs.push(record);
    
    if (this.logs.length > 500) {
      this.logs.shift();
    }

    unlock();

    console.log(record.message);

    sseManager.broadcast([record], "log");
  }

  /**
   * Internal dispatch: builds a record for the given message and type, then writes it.
   * @param message - The log message.
   * @param type - The log severity.
   * @param [opts] - Optional metadata.
   */
  private async log(message: string, type: LogType, opts?: LogRecordOpts) {
    const record = await this.buildRecord(type, message, opts);
    await this.writeRecord(record);
  }

  /**
   * Logs an info-level message.
   * @param message - The message to log.
   * @param [opts] - Optional metadata.
   */
  public async info(message: string, opts?: LogRecordOpts) {
    this.log(message, "infos", opts);
  }

  /**
   * Logs a warning-level message.
   * @param message - The message to log.
   * @param [opts] - Optional metadata.
   */
  public async warn(message: string, opts?: LogRecordOpts) {
    this.log(message, "warnings", opts);
  }

  /**
   * Logs an error-level message.
   * @param message - The message to log.
   * @param [opts] - Optional metadata.
   */
  public async error(message: string, opts?: LogRecordOpts) {
    this.log(message, "errors", opts);
  }

  /**
   * Logs a debug-level message. Only writes when the logger is in debug mode.
   * @param message - The message to log.
   * @param [opts] - Optional metadata.
   */
  public async debug(message: string, opts?: LogRecordOpts) {
    if (this.logLevel !== "debug") return;

    this.log(message, "debug", opts);
  }

  /**
   * Returns the in-memory buffer of recent log records (up to 500).
   * @returns The log records.
   */
  public getLogs(): LogRecord[] {
    return this.logs;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logger: Logger = (globalThis as any).logger || ((globalThis as any).logger = new Logger());

if (!logger.isInitialized()) {
  await logger.init();
}

export default logger;
