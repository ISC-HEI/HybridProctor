'use client'

import { type LogRecord, type LogType } from "@srvtypes/logger";
import style from './index.module.scss';
import Log from "../log";
import { Signal } from "@preact/signals";
import { VList } from "virtua";

interface LogsProps {
  logs: Signal<LogRecord[]>;
  type: Signal<LogType>;  
}

export default function Logs({ type, logs }: LogsProps) {
  const filteredLogs = logs.value.filter(log => type.value === "all" || log.type === type.value).reverse();

  const lastUUID = type.value === "all" 
    ? logs.value[0].uuid 
    : filteredLogs[filteredLogs.indexOf(filteredLogs.filter(log => log.type === type.value)[0])].uuid;

  return (
    <VList className={style.logs}>
      {filteredLogs.map(log => {
        return (
          <div>
            <Log record={log} isNew={true} isLast={log.uuid === lastUUID} />
          </div>
        );
      })}
    </VList>
  );
}
