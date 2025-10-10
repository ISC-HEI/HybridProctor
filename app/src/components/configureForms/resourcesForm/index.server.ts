'use server'

import storage from "@/lib/services/storage";

export async function uploadResources(file: File) {
  storage.writeResources(file);
}
