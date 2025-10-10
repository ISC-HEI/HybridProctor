'use server'

import storage from "@/lib/services/storage";
import { Yamlconf } from "@/lib/types/yamlconf";


export default async function uploadConfig(conf: Yamlconf) {
  storage.writeConfig(conf);
}
