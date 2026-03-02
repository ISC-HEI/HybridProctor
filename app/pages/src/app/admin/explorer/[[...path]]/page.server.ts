'use server'

import storage from "@/lib/services/storage"
import { DirItem } from "@/lib/types/dirItem";
import { PathLike } from "fs"

export async function fetchItems(path?: PathLike) {
  return await storage.readDir(path);
}

export async function fetchDisk() {
  return await storage.getDiskUsage();
}

export async function prepareDownload(items: DirItem[]) {
  return storage.prepareDownload(items);
}
