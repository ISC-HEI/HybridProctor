import dayjs from "dayjs";
import { appState } from "../state";

/**
 * Returns the current time adjusted by the stored offset (milliseconds).
 * @returns The adjusted Dayjs object.
 */
export function getTime() {
  return dayjs().add(appState.timeOffset, "ms");
}

/**
 * Returns the adjusted current time as a Unix timestamp (seconds since epoch).
 * @returns The unix timestamp.
 */
export function unixTime() {
  return (getTime()).unix();
}
