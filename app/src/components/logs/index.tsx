'use client'

import { type LogRecord, type LogType } from "@services/logger";
import style from './index.module.scss';
import Log from "../log";
import { AnimatePresence } from "motion/react";

interface LogsProps {
  logs: LogRecord[];
  type: LogType;  
}

export default function Logs({ type, logs }: LogsProps) {
  const reversedLogs = logs.toReversed();

  const lastIndex = type === "all" 
    ? 0 
    : reversedLogs.indexOf(reversedLogs.filter(log => log.type === type)[0]);


  return (
    <>
      <ol className={style.logs}>
        <AnimatePresence>
          {
            reversedLogs.map((v, i) =>
            {
                return (type === "all" || v.type === type) && <Log key={v.uuid} record={v} isNew={i === lastIndex}></Log>
              }
            )
          }
        </AnimatePresence>
      </ol>
    </>
  )
}
