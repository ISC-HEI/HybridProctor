'use server'

import storage from "@/lib/services/storage";


export async function undefinePassword() {
  storage.newPassword = undefined;
}
