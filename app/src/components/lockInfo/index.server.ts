'use server'

import storage from "@/lib/services/storage"


export async function lock() {
  storage.locked = !storage.locked
}
