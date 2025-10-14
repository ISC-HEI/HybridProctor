'use server'

import storage from "@/lib/services/storage";

export async function fetchNewPassword(): Promise<string|undefined> {
  return storage.newPassword;
}
