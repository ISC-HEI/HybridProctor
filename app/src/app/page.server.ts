'use server'

import { getNameFromIp } from '@services/db/helpers';
import logger from '@services/logger';
import { getIp } from '@utils/network';
import storage from '@services/storage';
import { Yamlconf } from '@lib/types/yamlconf';
import fs from 'fs/promises';
import { network } from '@/lib/services/network';

interface Ps {
  ok: boolean;
  message: string;
}

export async function fetchResources(): Promise<string[]> {
  return storage.resources;
}

export async function fetchConfig(): Promise<Yamlconf> {
  return storage.examConfig;
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

  const ip = await getIp();
  
  for (const file of files) {
    if (!storage.examConfig.files.includes(file.name)) {
      return {
        ok: false,
        message: `File "${file.name}" is not part of the required files.`,
      }
    }
  }

  const missing = storage.examConfig.files.filter(req => !uploadedNames.includes(req));
  if (missing.length > 0) {
    return {
      ok: false,
      message: `Missing required files: "${missing.join('", ')}"`,
    }
  }
  
  const name = await getNameFromIp(ip);

  if (!name) {
    return {
      ok: false,
      message: "Please refresh and enter your name.",
    }
  }

  logger.info(`files uploaded by ${name}.`, { issuer: name, action: "Uploaded files" })
  await storage.writeStudentFiles(ip, files);

  await network.addUpdate(ip, { ip, allFilesSent: true });

  return {
    ok: true,
    message: "Files successfully sent.",
  };
}
