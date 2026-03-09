import dayjs from "dayjs";
import { appState } from "../state";

export async function getTime() {
  const pollIntervalMs = 50;

  while (appState.timeOffset < 0) {
    await new Promise(resolve => setTimeout(resolve, pollIntervalMs));
  }

  return dayjs().add(appState.timeOffset, "ms");
}

export async function unixTime() {
  return (await getTime()).unix();
}
