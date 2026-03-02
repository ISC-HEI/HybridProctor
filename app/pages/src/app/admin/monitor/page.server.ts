'use server'

import { getUrl } from "@/lib/utils/network"

export async function fetchUrl() {
  return await getUrl();
}
