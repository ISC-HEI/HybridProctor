
import fs, { readdir, statfs } from "fs/promises";
import { existsSync, PathLike, createWriteStream, createReadStream } from "fs";
import { Readable } from "stream";
import { pipeline } from "stream/promises";
import path, { join } from "path";
import os from "os";
import archiver from "archiver";
import { type Yamlconf } from "@lib/types/yamlconf";
import logger from "./logger";
import yaml from 'js-yaml';
import crypto from "crypto";
import argon2 from "argon2";
import { Session } from "../types/session";
import dayjs from "dayjs";
import { DirItem } from "../types/dirItem";
import { v4 as uuidv4 } from "uuid";
import network from "./network";
import { getTime, unixTime } from "../utils/time";

const DEFAULT_ROOT_PATH = "/mount_point";
const DEFAULT_UPLOAD_PATH = "/mount_point/uploads";
const DEFAULT_EXAM_FILE_NAME = "exam.html";
const DEFAULT_PASSWORD_FILE = "/mount_point/.password";

const AVERAGE_LATENCY = 165;

class Storage {
  rootLocation: string;
  examLocation: string;
  uploadLocation: string;
  passwordLocation: string;
  initialized: boolean = false;
  examConfig!: Yamlconf;
  resources!: string[];
  version!: string;
  locked: boolean = true;
  timeOffset: number = -1;

  private sessions: Map<string, Session> = new Map<string, Session>();
  newPassword: string|undefined;
  private password!: string;

  constructor() {
    if (!process.env.UPLOAD_PATH || !process.env.EXAM_FILE_NAME || !process.env.PASSWORD_FILE || !process.env.ROOT_PATH) {
      throw new Error(".env is not configured correctly!!!");
    }

    this.rootLocation = process.env.ROOT_PATH !== "default" ? process.env.ROOT_PATH : DEFAULT_ROOT_PATH;
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
    const sanitizedFileName = path.basename(file.name);
    const fullLocation = path.join(location, sanitizedFileName);
    const nodeStream = createWriteStream(fullLocation);
    const webStream = file.stream();

    // @ts-expect-error type
    await pipeline(Readable.fromWeb(webStream), nodeStream);

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

    if (session.until <= await unixTime()) {
      this.sessions.delete(id);

      return false;
    }

    if (session.ip !== ip) {
      logger.warn(`IP '${ip}' tried to login using session with IP '${session.ip}'.`, { issuer: ip, action: "tried" })

      return false;
    }

    return true;
  }

  public setOffset(timestamp: string) {
    const offset = dayjs().diff(dayjs(timestamp)) - AVERAGE_LATENCY;
    logger.info(`Time offset set to ${offset + AVERAGE_LATENCY}`)

    if (this.timeOffset <= 0 && offset >= 10000) {
      this.timeOffset = offset;
    }
    else if (this.timeOffset <= 0) {
      this.timeOffset = 0;
    }
  }

  public async createSession(ip: string) {
    const id = crypto.randomUUID();

    this.sessions.set(id, {
      id,
      ip,
      until: (await getTime()).add(2, "hours").valueOf(),
    });

    return id;
  }

  public async writeExam(file: File) {
    const nodeStream = createWriteStream(this.examLocation);
    const webStream = file.stream();
     
    // @ts-expect-error type
    await pipeline(Readable.fromWeb(webStream), nodeStream);

    logger.debug(`Exam created at "${this.examLocation}".`);
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
    const student = await network.getStudent(ip);
    const name = student.name;

    if (!name) {
      logger.error(`IP ${ip} isn't registered!`, { issuer: ip });
      return "";
    }

    const namePath = join(this.uploadLocation, (await getTime()).format(`DD_MM_YYYY`), name);

    if (!existsSync(namePath)) {
      await fs.mkdir(namePath, { recursive: true });
    }

    const regex = /^v[0-9]+(?:_validated)?$/i;

    const entries = await fs.readdir(namePath, { withFileTypes: true });

    const version = entries.filter(entry => entry.isDirectory() && regex.test(entry.name)).length + 1;

    const versionFolder = path.join(namePath, `v${version}`);

    await fs.mkdir(versionFolder, { recursive: true });

    await Promise.all(files.map((file) => this.write(versionFolder, file)));

    const items = await fs.readdir(versionFolder, { withFileTypes: true });

    items.sort((a, b) => a.name.localeCompare(b.name));

    const digest = crypto.createHash("md5");

    for (const item of items) {
      if (item.isFile()) {
        digest.update(item.name);
        const itemPath = path.join(versionFolder, item.name);
        const stream = createReadStream(itemPath);
        for await (const chunk of stream) {
            digest.update(chunk);
        }
      }
    }

    const hash = digest.digest("hex");

    student.latestVersion.hash = hash;
    student.latestVersion.path = versionFolder;
    return hash;
  }

  public async validateAndEnd(ip: string) {
    const student = await network.getStudent(ip);
    const name = student.name;

    if (!name) {
      return false;
    }

    await fs.writeFile(path.join(student.latestVersion.path, "hash.md5"), student.latestVersion.hash);

    const newPath = `${student.latestVersion.path}_validated`;

    fs.rename(student.latestVersion.path, newPath);

    return true;
  }

  public async readDir(relativePath?: PathLike) {
    const currentPath = relativePath?.toString() || "";
    const absolutePath = join(this.rootLocation, currentPath);

    const resolvedPath = path.resolve(absolutePath);
    const resolvedRoot = path.resolve(this.rootLocation);

    if (!resolvedPath.startsWith(resolvedRoot)) {
      logger.warn(`Path traversal attempt detected: '${currentPath}'`, { issuer: "system", action: "read" });
      return false;
    }

    try {
      const items = await readdir(resolvedPath, { withFileTypes: true });

      const dirItems: DirItem[] = items.map(entry => (
        {
          id: uuidv4(),
          name: entry.name,
          path: currentPath,
          type: entry.isDirectory() ? "directory" : "file"
        }
      ));

      return dirItems

    } catch (e) {
      logger.error(`Error reading directory: ${resolvedPath}`)
      console.log(e);
      return false
    }
  }

  public async getDiskUsage() {
    const path = this.rootLocation !== '.' ? this.rootLocation : '/';

    const space = await statfs(path);

    const total = space.blocks * space.bsize;
    const used = (space.blocks - space.bfree) * space.bsize;

    return { total, used };
  }

  public prepareDownload(items: DirItem[]): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const archive = archiver("zip", {
        zlib: { level: 9 },
      });

      const zipName = `${uuidv4()}.zip`;
      const tempPath = path.join(os.tmpdir(), zipName);
      const output = createWriteStream(tempPath);

      output.on("close", () => {
        logger.info(`Created zip file: ${tempPath}`);
        resolve(zipName);
      });

      archive.on("error", (err) => {
        logger.error(`Error creating zip file: ${err.message}`);
        reject(err);
      });

      archive.pipe(output);

      const resolvedRoot = path.resolve(this.rootLocation);

      for (const item of items) {
        const itemPath = path.join(this.rootLocation, item.path.toString(), item.name);
        const resolvedPath = path.resolve(itemPath);

        if (!resolvedPath.startsWith(resolvedRoot)) {
          logger.warn(`Path traversal attempt detected in zip creation: '${item.path}/${item.name}'`, { issuer: "system", action: "zip" });
          reject(new Error("Path traversal attempt"));
          return;
        }

        if (item.type === "directory") {
          archive.directory(resolvedPath, item.name);
        } else {
          archive.file(resolvedPath, { name: item.name });
        }
      }

      archive.finalize();
    });
  }
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
const storage: Storage = (globalThis as any).storage || ((globalThis as any).storage = new Storage());

if (!storage.initialized) {
  await storage.init();
}

export default storage;
