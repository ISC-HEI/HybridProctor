
import fs from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";
import dayjs from "dayjs";
import "dayjs/locale/fr-ch";
import firstline from "firstline";

dayjs.locale("fr-ch");

const LATEST_LOG_NAME = "latest.log";
const DEFAULT_LOG_PATH = "/mount_point/logs";

class Logger {
  logLevel: "default"|"debug";
  logPath: string;
  logFilePath: string;
  initialized: boolean = false;

  constructor() {
    if ((!process.env.LOG_LEVEL || !process.env.LOG_PATH) && (process.env.LOG_LEVEL !== "default" && process.env.LOG_LEVEL !== "debug")) {
      throw new Error(".env is not configured correctly!!!");
    }

    this.logLevel = process.env.LOG_LEVEL as "default"|"debug";
    this.logPath = process.env.LOG_PATH !== "default" ? process.env.LOG_PATH as string : DEFAULT_LOG_PATH;
    this.logFilePath = join(this.logPath, LATEST_LOG_NAME);
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
  }

  private async renameLatest() {
    const fl = await firstline(this.logFilePath);

    const newName = `${fl.substring(4, 28).replace(".", "").replace(/[ :]/gi, "_")}.log`;

    await fs.rename(this.logFilePath, join(this.logPath, newName));
  }

  private getTime() {
    return dayjs().format(`ddd DD-MM-YYYY HH:mm:ss${this.logLevel === "debug" ? ":SSS" : ""} +01:00 (CET)`);
  }

  private async log(message: string) {
    await fs.appendFile(this.logFilePath, message + "\n", "utf8");
  }

  public async info(message: string) {
    await this.log(`[I] ${this.getTime()} | ${message}`);
  }

  public async warn(message: string) {
    await this.log(`[W] ${this.getTime()} | ${message}`);
  }

  public async error(message: string) {
    await this.log(`[E] ${this.getTime()} | ${message}`);
  }

  public async debug(message: string) {
    if (this.logLevel !== "debug") return;

    await this.log(`[D] ${this.getTime()} | ${message}`);
  }
}

const logger = new Logger();
logger.init();

export default logger;
