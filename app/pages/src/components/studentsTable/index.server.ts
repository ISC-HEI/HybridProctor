'use server'

import logger from "@/lib/services/logger";
import network from "@/lib/services/network";
import sseManager from "@/lib/services/sse";
import storage from "@/lib/services/storage";
import { Student } from "@/lib/types/student";


export async function changeFinishedStatus(student: Student) {
  const ip = student.ip;
  const finished = !student.finished

  network.addUpdate(ip, { ip, finished });

  logger.warn(`Admin changed 'finished' status of ${student.name !== '' ? student.name : `${student.ip} (Unknown name)`}`, { action: "Changed a status", issuer: "Admin" });

  sseManager.send(ip, { locked: storage.locked, finished }, "std", false);
}
