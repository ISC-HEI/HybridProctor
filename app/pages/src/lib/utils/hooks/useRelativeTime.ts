'use client'

import { useEffect } from "preact/hooks";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { signal } from "@preact/signals";

dayjs.extend(relativeTime);

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
