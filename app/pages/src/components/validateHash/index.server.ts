'use server'

import logger from "@/lib/services/logger";
import network from "@/lib/services/network";
import sseManager from "@/lib/services/sse";
import storage from "@/lib/services/storage"
import { getIp } from "@/lib/utils/network"


export async function validateHash(hash: string) {
  const ip = await getIp();

  const student = await network.getStudent(ip);

  if (hash !== student.latestVersion.hash) {
    return {
      ok: false,
      message: "This hash isn't the latest one."
    }
  }

  if (!storage.validateAndEnd(ip)) {
    return {
      ok: false,
      message: "Error validating hash."
    }
  }

  await network.addUpdate(ip, { ip, finished: true });

  sseManager.send(ip, { locked: storage.locked, finished: true }, "std", false);
  logger.info(`Student ${student.name} finished`, { action: "Finished", issuer: student.name })

  return {
    ok: true,
    message: "Successfully validated hash and finished exam."
  }
}
