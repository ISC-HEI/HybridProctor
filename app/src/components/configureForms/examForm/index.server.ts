'use server'

import storage from "@/lib/services/storage"


export async function uploadExam(exam: File) {
  storage.writeExam(exam);
}
