
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import db from "./db";

class Storage {
  location: string;
  initialized: boolean = false;

  constructor() {
    if (!process.env.UPLOAD_PATH) {
      throw new Error(".env is not configured correctly!!!");
    }

    this.location = process.env.UPLOAD_PATH; 
  }

  public async init() {
    if (this.initialized) {
      throw new Error("Storage already initialized!");
    }

    this.initialized = true;

    if (!existsSync(this.location)) {
      await fs.mkdir(this.location, { recursive: true });
    }
  }

  public async write(ip: string, files: File[]) {
    const name = (db.prepare("SELECT name FROM students WHERE ip = ?;").get(ip) as { name: string }).name;

    const nameFolder = path.join(this.location, name);

    if (!existsSync(nameFolder)) {
      await fs.mkdir(nameFolder, { recursive: true });
    }

    for (const file of files) {
      console.log(file.name, file.size)
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(nameFolder, file.name), buffer);
    }
  }
}

const storage = new Storage();
await storage.init();

export default storage;
