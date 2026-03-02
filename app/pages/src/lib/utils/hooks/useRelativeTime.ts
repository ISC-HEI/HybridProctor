'use client'

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function useRelativeTime(timestamp: string) {
  const [text, setText] = useState<string>(() => dayjs(timestamp).fromNow());

  useEffect(() => {
    const update = () => setText(dayjs(timestamp).fromNow());

    update();

    const interval = setInterval(update, 60000);
    
    return () => clearInterval(interval);
  });

  return text;
}
