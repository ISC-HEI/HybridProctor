'use server'

import logger from '@/utils/logger';
import { getIp } from '@/utils/network';
import storage from '@/utils/storage';
import { Yamlconf } from '@/utils/types/yamlconf';
import fs from 'fs/promises';
import yaml from "js-yaml";

export async function fetchResources(): Promise<string[]> {
  const files = await fs.readdir("public/resources");
  logger.debug("Fetched resources.");
  return files
}

export async function fetchConfig(): Promise<Yamlconf> {
  const yamlconf = yaml.load(await fs.readFile("public/config.yml", "utf8")) as Yamlconf;
  logger.debug("Fetched config.");

  return yamlconf
}

export async function fetchVersion(): Promise<string> {
  const data = await fs.readFile("package.json", "utf8");

  const packageJson = await JSON.parse(data);
  
  logger.debug("Fetched and parsed version.");

  return `Version : ${packageJson.version}`
}

export async function uploadFiles(formData: FormData) {
  const files = formData.getAll("files") as File[];
  await storage.write(await getIp(), files); 
}
