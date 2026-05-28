
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

  constructor() {
    if ((!process.env.LOG_LEVEL || !process.env.LOG_PATH) && (process.env.LOG_LEVEL !== "default" && process.env.LOG_LEVEL !== "debug")) {
      throw new Error(".env is not configured correctly!!!");
    }

    this.logLevel = process.env.LOG_LEVEL as "default"|"debug";
    this.logPath = process.env.LOG_PATH !== "default" ? process.env.LOG_PATH as string : DEFAULT_LOG_PATH;
    this.logFilePath = join(this.logPath, LATEST_LOG_NAME);
  }

  public isInitialized(){
    return this.initialized;
  }

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

  private async renameLatest() {
    const fl = await firstline(this.logFilePath);

    if (!fl || fl === "") {
      await fs.rm(this.logFilePath);
      return;
    }

    const newName = `${fl.substring(4, 28).replace(".", "").replace(/[ :]/gi, "_")}.log`;

    await fs.rename(this.logFilePath, join(this.logPath, newName));
  }

  private getFormatedTime(timestamp: Dayjs) {
    return timestamp.format(`ddd DD-MM-YYYY HH:mm:ss${this.logLevel === "debug" ? ":SSS" : ""} +01:00 (CET)`);
  }

  private async buildRecord(type: LogType, message: string, opts?: LogRecordOpts): Promise<LogRecord> {
    const timestamp = await getTime();
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

  public async info(message: string, opts?: LogRecordOpts) {
    const record = await this.buildRecord("infos", message, opts);
    await this.writeRecord(record);
  }

  public async warn(message: string, opts?: LogRecordOpts) {
    const record = await this.buildRecord("warnings", message, opts);
    await this.writeRecord(record);
  }

  public async error(message: string, opts?: LogRecordOpts) {
    const record = await this.buildRecord("errors", message, opts);
    await this.writeRecord(record);
  }

  public async debug(message: string, opts?: LogRecordOpts) {
    if (this.logLevel !== "debug") return;

    const record = await this.buildRecord("debug", message, opts);
    await this.writeRecord(record);
  }

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
