import dayjs from "dayjs"

export async function getTime() {
  const pollIntervalMs = 50;
  const storage = (await import("@services/storage")).default

  while (storage.timeOffset < 0) {
    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }

  return dayjs().add(storage.timeOffset, "ms");
}

export async function unixTime() {
  return (await getTime()).unix()
}
