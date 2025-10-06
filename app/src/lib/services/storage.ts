
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { type Yamlconf } from "@lib/types/yamlconf";
import logger from "./logger";
import yaml from 'js-yaml';
import { getNameFromIp } from "./db/helpers";

const DEFAULT_UPLOAD_PATH = "/mount_point/uploads";
const DEFAULT_EXAM_FILE_NAME = "exam.html";

class Storage {
  examLocation: string;
  uploadLocation: string;
  initialized: boolean = false;
  examConfig!: Yamlconf;

  resources!: string[];

  constructor() {
    if (!process.env.UPLOAD_PATH || !process.env.EXAM_FILE_NAME) {
      throw new Error(".env is not configured correctly!!!");
    }

    this.uploadLocation = process.env.UPLOAD_PATH !== "default" ? process.env.UPLOAD_PATH : DEFAULT_UPLOAD_PATH;
    this.examLocation = path.join("public", process.env.EXAM_FILE_NAME !== "default" ? process.env.EXAM_FILE_NAME : DEFAULT_EXAM_FILE_NAME);
  }

  public async init() {
    if (this.initialized) {
      throw new Error("Storage already initialized!");
    }

    this.initialized = true;

    if (!existsSync(this.uploadLocation)) {
      await fs.mkdir(this.uploadLocation, { recursive: true });
    }


    this.resources = await fs.readdir("public/resources");
    logger.debug("Fetched resources.");

    this.examConfig = yaml.load(await fs.readFile("public/config.yml", "utf8")) as Yamlconf;
    logger.debug("Loaded config.")

    logger.debug("Initialized storage.");
  }

  private async write(location: string, file: File) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fullLocation = path.join(location, file.name);

    await fs.writeFile(fullLocation, buffer);

    logger.debug(`Created file "${fullLocation}".`);
  }

  public async writeExam(file: File) {
    const buffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(this.examLocation, buffer);

    logger.debug(`Exam created at "${this.examLocation}".`)
  }

  public async writeStudentFiles(ip: string, files: File[]) {
    const name = await getNameFromIp(ip);

    if (!name) {
      logger.error(`IP ${ip} isn't registered!`, { issuer: ip });
      return false;
    }

    const nameFolder = path.join(this.uploadLocation, name);

    if (!existsSync(nameFolder)) {
      await fs.mkdir(nameFolder, { recursive: true });
    }

    for (const file of files) {
      this.write(nameFolder, file);
    }

    return true;
  }
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const storage: Storage = (globalThis as any).storage || ((globalThis as any).storage = new Storage());

if (!storage.initialized) {
  await storage.init();
}

export default storage;
