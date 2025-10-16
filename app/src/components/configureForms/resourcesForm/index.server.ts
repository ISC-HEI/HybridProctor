'use server'

import storage from "@/lib/services/storage";

export async function uploadResources(files: File[]) {
  storage.writeResources(files);
}
