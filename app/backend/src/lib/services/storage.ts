import fs, { readdir, statfs } from "fs/promises";
import { existsSync,  type PathLike, createWriteStream, createReadStream } from "fs";
import path, { join } from "path";
import os from "os";
import archiver from "archiver";
import { type Yamlconf } from "@/lib/types/yamlconf";
import logger from "./logger";
import yaml from 'js-yaml';
import crypto from "crypto";
import { type Session } from "../types/session";
import dayjs from "dayjs";
import { type DirItem } from "../types/dirItem";
import { v4 as uuidv4 } from "uuid";
import network from "./network";
import { appState } from "../state";
import { getTime, unixTime } from "../utils/time";

const DEFAULT_ROOT_PATH = "/mount_point";
const DEFAULT_UPLOAD_PATH = "/mount_point/uploads";
const DEFAULT_EXAM_FILE_NAME = "exam.html";
const DEFAULT_PASSWORD_FILE = "/mount_point/.password";

const AVERAGE_LATENCY = 200;

class Storage {
  initialized: boolean = false;

  rootLocation: string;
  examLocation: string;
  resourcesLocation: string;
  uploadLocation: string;
  passwordLocation: string;

  examConfig!: Yamlconf;
  resources!: string[];
  version!: string;

  // Temp password shown on first run, cleared once admin sets a new one
  newPassword: string|undefined;

  get locked(): boolean {
    return appState.locked;
  }
  set locked(value: boolean) {
    appState.locked = value;
  }

  get timeOffset(): number {
    return appState.timeOffset;
  }
  set timeOffset(value: number) {
    appState.timeOffset = value;
  }

  // SHA-256 hash of the stored admin password
  private password!: string;

  private sessions: Map<string, Session> = new Map<string, Session>();

  /**
   * Resolves file and location paths from environment variables, falling back to defaults.
   */
  constructor() {
    if (!process.env.UPLOAD_PATH || !process.env.EXAM_FILE_NAME || !process.env.PASSWORD_FILE || !process.env.ROOT_PATH) {
      throw new Error(".env is not configured correctly!!!");
    }

    this.rootLocation = process.env.ROOT_PATH !== "default" ? process.env.ROOT_PATH : DEFAULT_ROOT_PATH;
    this.passwordLocation = process.env.PASSWORD_FILE !== "default" ? process.env.PASSWORD_FILE : DEFAULT_PASSWORD_FILE;
    this.uploadLocation = process.env.UPLOAD_PATH !== "default" ? process.env.UPLOAD_PATH : DEFAULT_UPLOAD_PATH;
    this.examLocation = path.join(this.local("public"), process.env.EXAM_FILE_NAME !== "default" ? process.env.EXAM_FILE_NAME : DEFAULT_EXAM_FILE_NAME);
    this.resourcesLocation = this.local("public/resources");

    this.timeOffset = 0
  }

  /**
   * Initializes storage: loads the admin password, exam config, and app version;
   * creates required directories if they do not exist.
   * @throws {Error} If storage has already been initialized.
   */
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

    if (!existsSync(this.resourcesLocation)) {
      await fs.mkdir(this.resourcesLocation, { recursive: true });
    }

    this.resources = await fs.readdir("public/resources");
    logger.debug("Fetched resources.");

    if (!existsSync(this.local("public/config.yml"))) {
      logger.debug("No config, falling back to default");
      this.examConfig = {
        enable: false,
        validation: false,
        label: "Default config",
        studentsFiles: []
      }

    } else {
      this.examConfig = yaml.load(await fs.readFile(this.local("public/config.yml"), "utf8")) as Yamlconf;
    }
    logger.debug("Loaded config.")

    const data = await fs.readFile("package.json", "utf8");

    const packageJson = await JSON.parse(data);
    
    this.version = packageJson.version;

    logger.debug("Fetched and parsed version.");

    logger.debug("Initialized storage.");
  }

  /**
   * Computes a SHA-256 base64 digest of the input string.
   * @param data - The string to hash.
   * @returns The base64-encoded hash.
   */
  private createHash(data: string) {
    const hashObject = crypto.createHash("sha256");
    return hashObject.update(data).digest("base64");
  }

  /**
   * Generates a random password, writes its SHA-256 hash to the password file,
   * and stores the plain-text version in `newPassword` for first-time display.
   */
  private async generatePassword() {
    this.newPassword = Buffer.from(crypto.randomBytes(20)).toString("base64").replace('=', '');
    const hash = this.createHash(this.newPassword);

    await fs.writeFile(this.passwordLocation, hash);

    logger.info("New password generated.");
  }

  /**
   * Moves a multer-uploaded file to the target directory, sanitizing the filename.
   * @param location - The destination directory.
   * @param file - The uploaded file to persist.
   */
  private async write(location: string, file: Express.Multer.File) {
    const sanitizedFileName = path.basename(file.originalname);
    const fullLocation = path.join(location, sanitizedFileName);
    
    await this.moveFile(file.path, fullLocation);

    logger.debug(`Created file "${fullLocation}".`);
  }

  /**
   * Resolves a path relative to the current working directory.
   * @param p - The relative path.
   * @returns The absolute path.
   */
  private local(p: string) {
    return path.join(process.cwd(), p);
  }

  /**
   * Removes all files inside the given directory.
   * @param directory - The directory to clear.
   */
  private async deleteContent(directory: string) {
    const files = await fs.readdir(directory);

    for (const file of files) {
      await fs.rm(path.join(directory, file));
    }
  }

  /**
   * Copies a file from source to destination, then removes the source file.
   * @param source - The path to the source file.
   * @param destination - The destination path.
   */
  public async moveFile(source: string, destination: string) {
    try {
      await fs.copyFile(source, destination);
      await fs.unlink(source);
    } catch (error: any) {
      logger.error(`Failed to move file from ${source} to ${destination}`);
      console.error(error);
    }
  }

  /**
   * Compares a plaintext password against the stored SHA-256 hash.
   * @param password - The plaintext password to check.
   * @returns Whether the password is correct.
   */
  public verifyPassword(password: string) {
    return this.password === this.createHash(password);
  }

  /**
   * Validates an admin session by ID, IP address, and expiry time.
   * Expired sessions are automatically removed.
   * @param id - The session ID.
   * @param ip - The client IP to match against the session.
   * @returns Whether the session is valid.
   */
  public async verifySession(id: string, ip: string) {
    if (!this.sessions.has(id)) {
      return false;
    }

    const session = this.sessions.get(id) as Session;

    if (session.until <= unixTime()) {
      this.sessions.delete(id);

      return false;
    }

    if (session.ip !== ip) {
      logger.warn(`IP '${ip}' tried to login using session with IP '${session.ip}'.`, { issuer: ip, action: "tried" })

      return false;
    }

    return true;
  }

  /**
   * Calibrates the server clock offset using a client-provided timestamp,
   * accounting for average network latency.
   * @param timestamp - The ISO timestamp from the client.
   */
  public setOffset(timestamp: string) {
    const offset = dayjs(timestamp).diff(dayjs()) - AVERAGE_LATENCY;
    logger.debug(`Time offset set to ${offset}`);
    logger.info(`Router time set to ${getTime().format("ddd DD-MM-YYYY HH:mm:ss")}`);

    this.timeOffset = offset;
  }

  /**
   * Creates a new admin session valid for 2 hours.
   * @param ip - The IP address of the admin.
   * @returns The newly created session ID.
   */
  public async createSession(ip: string) {
    const id = crypto.randomUUID();

    this.sessions.set(id, {
      id,
      ip,
      until: (getTime()).add(2, "hours").valueOf(),
    });

    logger.debug(`Session created for ip: ${ip}`);

    return id;
  }

  /**
   * Saves the uploaded exam HTML file to the configured exam location.
   * @param file - The uploaded exam file.
   */
  public async writeExam(file: Express.Multer.File) {
    await this.moveFile(file.path, this.examLocation);

    logger.debug(`Exam created at "${this.examLocation}".`);
  }

  /**
   * Persists a YAML exam configuration to disk and updates the in-memory config.
   * @param conf - The exam configuration object.
   */
  public async writeConfig(conf: Yamlconf) {
    const yamlConfString = yaml.dump(conf);

    await fs.writeFile("public/config.yml", yamlConfString);

    this.examConfig = conf;

    logger.info(`Exam config modified`);
  }

  /**
   * Replaces all exam resource files with a new set of uploaded files.
   * @param files - The new resource files.
   */
  public async writeResources(files: Express.Multer.File[]) {
    await this.deleteContent("public/resources");
    this.resources = [];

    for (const file of files) {
      await this.write(this.local("public/resources"), file);
      this.resources.push(file.originalname);
    }

    logger.info(`Exam resources modified`);
  }

  /**
   * Saves student submission files with automatic versioning and computes an MD5 digest
   * of the uploaded content. The files are stored under a date- and name-based directory tree.
   * @param ip - The student's IP address.
   * @param files - The uploaded submission files.
   * @returns The MD5 hash of the submission, or an empty string on failure.
   */
  public async writeStudentFiles(ip: string, files: Express.Multer.File[]) {
    const student = await network.getStudent(ip);
    const name = student.name;

    if (!name) {
      logger.error(`IP ${ip} isn't registered!`, { issuer: ip });
      return "";
    }

    const namePath = join(this.uploadLocation, (getTime()).format(`DD_MM_YYYY`), name);

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

  /**
   * Finalizes a student's submission by writing the MD5 hash file and renaming the
   * version folder with a `_validated` suffix.
   * @param ip - The student's IP address.
   * @returns Whether the validation succeeded.
   */
  public async validateAndEnd(ip: string) {
    const student = await network.getStudent(ip);
    const name = student.name;

    if (!name) {
      return false;
    }

    await fs.writeFile(path.join(student.latestVersion.path, "hash.md5"), student.latestVersion.hash);

    const newPath = `${student.latestVersion.path}_validated`;

    await fs.rename(student.latestVersion.path, newPath);

    return true;
  }

  /**
   * Lists the contents of a directory relative to `rootLocation`, with path-traversal protection.
   * @param [relativePath] - The directory path relative to root.
   * @returns An array of directory items, or false on error or traversal attempt.
   */
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

  /**
   * Returns the total and used disk space (in bytes) on the root storage mount.
   * @returns Disk usage statistics.
   */
  public async getDiskUsage() {
    const path = this.rootLocation !== '.' ? this.rootLocation : '/';

    const space = await statfs(path);

    const total = space.blocks * space.bsize;
    const used = (space.blocks - space.bfree) * space.bsize;

    return { total, used };
  }

  /**
   * Creates a zip archive of the selected directory items in a temporary location.
   * Each item is validated against path-traversal before being added.
   * @param items - The files and directories to include.
   * @returns The filename of the created zip archive.
   */
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
