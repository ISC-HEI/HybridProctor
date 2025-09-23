'use client'

import { useEffect, useState } from "react"
import { LogLine, LogType } from "@/utils/logger";
import style from './index.module.scss';

interface LogsProps {
  type: LogType;  
}

export default function Logs({ type }: LogsProps) {
  const [logs, setLogs] = useState<LogLine[]>([]);

  useEffect(() => {(
    async () => {
      const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_URL}/api/logs`);

      eventSource.onmessage = async (e) => {
        const data = await JSON.parse(e.data) as { message: LogLine[] };

        setLogs(prevLogs => [...prevLogs, ...data.message]);
      }

      return () => eventSource.close();
    }
  )()}, [])

  return (
    <>
      <ul className={style.logs}>
        {
          logs.map((v, i) =>
            {
              return (type === "all" || v.type === type) && <li key={i}>{v.line}</li>
            }
          )
        }
      </ul>
    </>
  )
}
