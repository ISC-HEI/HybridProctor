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
  const filteredLogs = logs.filter(log => type === "all" || log.type === type).reverse();

  const lastIndex = type === "all" 
    ? 0 
    : filteredLogs.indexOf(filteredLogs.filter(log => log.type === type)[0]);


  return (
    <>
      <ol className={style.logs}>
        <AnimatePresence>
          {
            filteredLogs.map((v, i) =>
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
