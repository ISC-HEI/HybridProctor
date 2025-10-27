
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import { type Yamlconf } from "@lib/types/yamlconf";
import logger from "./logger";
import yaml from 'js-yaml';
import { getNameFromIp } from "./db/helpers";
import crypto from "crypto";
import argon2 from "argon2";
import { Session } from "../types/session";
import dayjs from "dayjs";
import { getIp } from "../utils/network";

const DEFAULT_UPLOAD_PATH = "/mount_point/uploads";
const DEFAULT_EXAM_FILE_NAME = "exam.html";
const DEFAULT_PASSWORD_FILE = "/mount_point/.password";

class Storage {
  examLocation: string;
  uploadLocation: string;
  passwordLocation: string;
  initialized: boolean = false;
  examConfig!: Yamlconf;
  resources!: string[];
  version!: string;

  private sessions: Map<string, Session> = new Map<string, Session>();
  newPassword: string|undefined;
  private password!: string;

  constructor() {
    if (!process.env.UPLOAD_PATH || !process.env.EXAM_FILE_NAME || !process.env.PASSWORD_FILE) {
      throw new Error(".env is not configured correctly!!!");
    }

    this.passwordLocation = process.env.PASSWORD_FILE !== "default" ? process.env.PASSWORD_FILE : DEFAULT_PASSWORD_FILE;
    this.uploadLocation = process.env.UPLOAD_PATH !== "default" ? process.env.UPLOAD_PATH : DEFAULT_UPLOAD_PATH;
    this.examLocation = path.join("public", process.env.EXAM_FILE_NAME !== "default" ? process.env.EXAM_FILE_NAME : DEFAULT_EXAM_FILE_NAME);
  }

  public async init() {
    if (this.initialized) {
      throw new Error("Storage already initialized!");
    }

    this.initialized = true;

    if (!existsSync(this.passwordLocation)) {
      await this.generatePassword();
    }

    this.password = await fs.readFile(this.passwordLocation, "utf8");

    if (!existsSync(this.uploadLocation)) {
      await fs.mkdir(this.uploadLocation, { recursive: true });
    }


    this.resources = await fs.readdir("public/resources");
    logger.debug("Fetched resources.");

    this.examConfig = yaml.load(await fs.readFile("public/config.yml", "utf8")) as Yamlconf;
    logger.debug("Loaded config.")

    const data = await fs.readFile("package.json", "utf8");

    const packageJson = await JSON.parse(data);
    
    this.version = packageJson.version;

    logger.debug("Fetched and parsed version.");

    logger.debug("Initialized storage.");
  }

  private async generatePassword() {
    this.newPassword = Buffer.from(crypto.randomBytes(20)).toString("base64").replace('=', '');
    const hash = await argon2.hash(this.newPassword);

    await fs.writeFile(this.passwordLocation, hash);

    logger.info("New password generated.");
  }

  private async write(location: string, file: File) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fullLocation = path.join(location, file.name);

    await fs.writeFile(fullLocation, buffer);

    logger.debug(`Created file "${fullLocation}".`);
  }

  private async deleteContent(directory: string) {
    const files = await fs.readdir(directory);

    for (const file of files) {
      await fs.rm(path.join(directory, file));
    }
  }

  public async verifyPassword(password: string) {
    return await (argon2.verify(this.password, password));
  }

  public async verifySession(id: string, ip: string) {
    if (!this.sessions.has(id)) {
      return false;
    }

    const session = this.sessions.get(id) as Session;

    if (session.until <= Date.now()) {
      this.sessions.delete(id);

      return false;
    }

    if (session.ip !== ip) {
      logger.warn(`IP '${ip}' tried to login using session with IP '${session.ip}'.`, { issuer: ip, action: "tried" })

      return false;
    }

    return true;
  }

  public createSession(ip: string) {
    const id = crypto.randomUUID();

    this.sessions.set(id, {
      id,
      ip,
      until: dayjs().add(2, "hours").valueOf(),
    });

    return id;
  }

  public async writeExam(file: File) {
    const buffer = Buffer.from(await file.arrayBuffer());

    await fs.writeFile(this.examLocation, buffer);

    logger.debug(`Exam created at "${this.examLocation}".`)
  }

  public async writeConfig(conf: Yamlconf) {
    const yamlConfString = yaml.dump(conf);

    await fs.writeFile("public/config.yml", yamlConfString);

    this.examConfig = conf;
  }

  public async writeResources(files: File[]) {
    await this.deleteContent("public/resources");

    for (const file of files) {
      await this.write("public/resources", file);
    }

    this.resources = await fs.readdir("public/resources");
  }

  public async writeStudentFiles(ip: string, files: File[]) {
    const name = await getNameFromIp(ip);

    if (!name) {
      logger.error(`IP ${ip} isn't registered!`, { issuer: ip });
      return false;
    }

    const regex = new RegExp(`^${name} v[0-9]+$`, 'i');

    const entries = await fs.readdir(this.uploadLocation, { withFileTypes: true });

    const version = entries.filter(entry => entry.isDirectory() && regex.test(entry.name)).length + 1;

    const nameFolder = path.join(this.uploadLocation, `${name} v${version}`);

    await fs.mkdir(nameFolder, { recursive: true });

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
