'use server'

import { getNameFromIp } from '@services/db/helpers';
import logger from '@services/logger';
import { getIp, getUrl } from '@utils/network';
import storage from '@services/storage';
import { Yamlconf } from '@lib/types/yamlconf';
import network from '@/lib/services/network';

export async function fetchResources(): Promise<string[]> {
  return storage.resources;
}

export async function fetchConfig(): Promise<Yamlconf> {
  return storage.examConfig;
}

export async function fetchVersion(): Promise<string> {
  return storage.version
}

export async function fetchUrl() {
  return await getUrl();
}

export async function uploadFiles(files: File[]) {
  const ip = await getIp();
  const name = await getNameFromIp(ip);

  if (files.length < 1) {
    return {
      ok: false,
      message: "Please upload at least one file.",
      hash: ""
    }
  }

  if (storage.locked) {
    return {
      ok: false,
      message: "The exam hasn't started yet, or has already ended.",
      hash: ""
    }
  }

  const student = await network.getStudent(ip);

  if (student.finished) {
    return {
      ok: false,
      message: "You already validated your latest version.",
      hash: ""
    }
  }

  if (!name) {
    return {
      ok: false,
      message: "Please refresh and enter your name.",
      hash: ""
    }
  }

  if (storage.examConfig.studentsFiles.length === 0) {
    logger.info(`${name} finished the exam.`, { issuer: name, action: "Finished" })

    await network.addUpdate(ip, { ip, finished: true });

    return {
      ok: true,
      message: "Exam ended successfully",
      hash: ""
    }
  }

  const uploadedNames = files.map(f => f.name);

  const missing = storage.examConfig.studentsFiles.filter(req => !uploadedNames.includes(req));

  logger.info(`files uploaded by ${name}.`, { issuer: name, action: "Uploaded files" })

  const hash = await storage.writeStudentFiles(ip, files);

  return {
    ok: true,
    message: `Files successfully sent. ${missing.length > 0 ? `Missing required files: "${missing.join('", ')}"` : ''}`,
    hash
  };
}
