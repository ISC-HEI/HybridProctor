'use client'

import { type LogRecord, type LogType } from "@services/logger";
import style from './index.module.scss';
import Log from "../log";

interface LogsProps {
  logs: LogRecord[];
  type: LogType;  
}

export default function Logs({ type, logs }: LogsProps) {
  const reversedLogs = logs.toReversed();

  const lastIndex = type === "all" 
    ? 0 
    : reversedLogs.indexOf(reversedLogs.filter((v, i) => v.type === type)[0]);


  return (
    <>
      <ul className={style.logs}>
        {
          reversedLogs.map((v, i) =>
            {
              return (type === "all" || v.type === type) && <Log key={i} record={v} isNew={i === lastIndex}></Log>
            }
          )
        }
      </ul>
    </>
  )
}
