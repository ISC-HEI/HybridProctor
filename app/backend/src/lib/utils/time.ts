import dayjs from "dayjs";
import { appState } from "../state";

export function getTime() {
  return dayjs().add(appState.timeOffset, "ms");
}

export function unixTime() {
  return (getTime()).unix();
}
