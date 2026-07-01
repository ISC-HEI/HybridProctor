'use client'

import { useEffect } from "preact/hooks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { signal } from "@preact/signals";

dayjs.extend(relativeTime);

/**
 * Creates a reactive signal that displays the relative time from the given
 * timestamp, automatically updating every minute.
 * @param timestamp The ISO 8601 timestamp string to compute relative time from.
 * @returns A signal containing the relative time string (e.g. "5 minutes ago").
 */
export function useRelativeTime(timestamp: string) {
  const text = signal<string>(dayjs(timestamp).fromNow());

  useEffect(() => {
    const update = () => text.value = dayjs(timestamp).fromNow();

    update();

    const interval = setInterval(update, 60000);
    
    return () => clearInterval(interval);
  });

  return text;
}
