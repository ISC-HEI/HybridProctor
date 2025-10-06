'use server'

import storage from "@/lib/services/storage"


export async function uploadExam(formData: FormData) {
  const exam = formData.get("examFile") as File;

  storage.writeExam(exam);
}
