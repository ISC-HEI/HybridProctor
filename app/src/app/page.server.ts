'use server'

import { getNameFromIp } from '@/utils/dbHelpers';
import logger from '@/utils/logger';
import { getIp } from '@/utils/network';
import storage from '@/utils/storage';
import { Yamlconf } from '@/utils/types/yamlconf';
import fs from 'fs/promises';
import yaml from "js-yaml";

interface Ps {
  ok: boolean;
  message: string;
}

let yamlconf: Yamlconf;

export async function fetchResources(): Promise<string[]> {
  const files = await fs.readdir("public/resources");
  logger.debug("Fetched resources.");
  return files
}

export async function fetchConfig(): Promise<Yamlconf> {
  yamlconf = yaml.load(await fs.readFile("public/config.yml", "utf8")) as Yamlconf;
  logger.debug("Fetched config.");

  return yamlconf
}

export async function fetchVersion(): Promise<string> {
  const data = await fs.readFile("package.json", "utf8");

  const packageJson = await JSON.parse(data);
  
  logger.debug("Fetched and parsed version.");

  return `Version : ${packageJson.version}`
}

export async function uploadFiles(ps: Ps, formData: FormData) {
  const files = formData.getAll("files") as File[];
  const uploadedNames = files.map(f => f.name);
  
  for (const file of files) {
    if (!yamlconf.files.includes(file.name)) {
      return {
        ok: false,
        message: `File "${file.name}" is not part of the required files.`,
      }
    }
  }

  const missing = yamlconf.files.filter(req => !uploadedNames.includes(req));
  if (missing.length > 0) {
    return {
      ok: false,
      message: `Missing required files: "${missing.join('", ')}"`,
    }
  }
  
  logger.info(`files uploaded by ${await getNameFromIp(await getIp())}`)
  await storage.write(await getIp(), files);

  return {
    ok: true,
    message: "Files successfully sent.",
  };
}
