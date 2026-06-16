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
  const length: number = filteredLogs.length;

  const lastUUID = length === 0 ? "" :
    type.value === "all" 
      ? logs.value[0].uuid 
      : filteredLogs[length - 1].uuid;

  console.log(lastUUID)

  return (
    <>
    { length === 0
      ?
      <div className={style.no_entry}>
        <p>No entry matching the "{type}" filter</p>
      </div>
      :
      <VList className={style.logs}>
        {filteredLogs.map(log => {
          return (
            <div>
              <Log record={log} isNew={false} isLast={log.uuid === lastUUID} />
            </div>
          );
        })}
      </VList>
    }
    </>
  );
}
