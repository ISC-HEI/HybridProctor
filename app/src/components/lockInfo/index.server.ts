'use server'

import sseManager from "@/lib/services/sse";
import storage from "@/lib/services/storage"


export async function lock() {
  storage.locked = !storage.locked;

  sseManager.broadcast({ locked: storage.locked }, "std", false)
}

export async function fetchLocked() {
  return storage.locked;
}
