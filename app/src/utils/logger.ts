
import fs from "fs/promises";
import { existsSync, createReadStream } from "fs";
import { join } from "path";
import dayjs from "dayjs";
import "dayjs/locale/fr-ch";
import firstline from "firstline";
import readline from "readline";
import { sseManager } from "@utils/sse";

dayjs.locale("fr-ch");

const LATEST_LOG_NAME = "latest.log";
const DEFAULT_LOG_PATH = "/mount_point/logs";

export type LogType = "all"|"errors"|"warnings"|"infos"|"debug";
export type LogLine = {
  type: LogType;
  line: string;
}

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

  private getLineType(line: string): LogType {
    const lineTypeString = line[1];

    switch (lineTypeString) {
      case "I":
        return "infos";
      case 'W':
        return 'warnings';
      case 'E':
        return 'errors';
      default:
        return "debug";    
    }
  }

  private getTime() {
    return dayjs().format(`ddd DD-MM-YYYY HH:mm:ss${this.logLevel === "debug" ? ":SSS" : ""} +01:00 (CET)`);
  }

  private async log(message: string) {
    await fs.appendFile(this.logFilePath, `${message}\n`, "utf8");
  }

  public async info(message: string) {
    const msg = `[I] ${this.getTime()} | ${message}`;

    sseManager.broadcast({
      type: "infos",
      line: msg,
    });
    await this.log(msg);
  }

  public async warn(message: string) {
    const msg = `[W] ${this.getTime()} | ${message}`;

    sseManager.broadcast({
      type: "warnings",
      line: msg,
    })
    await this.log(msg);
  }

  public async error(message: string) {
    const msg = `[E] ${this.getTime()} | ${message}`;

    sseManager.broadcast({
      type: "errors",
      line: msg,
    })

    await this.log(msg);
  }

  public async debug(message: string) {
    if (this.logLevel !== "debug") return;

    const msg = `[D] ${this.getTime()} | ${message}`;
    
    sseManager.broadcast({
      type: "debug",
      line: msg,
    })

    await this.log(msg);
  }

  public async read() {
    const filteredLogs: LogLine[] = [];

    const fileStream = createReadStream(this.logFilePath, { encoding: "utf8" });

    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    for await (const line of rl) {
      filteredLogs.push({
        type: this.getLineType(line),
        line: line,
      })
    }

    return filteredLogs;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logger: Logger = (globalThis as any).logger || ((globalThis as any).logger = new Logger());

if (!logger.initialized) {
  logger.init();
}

export default logger;
