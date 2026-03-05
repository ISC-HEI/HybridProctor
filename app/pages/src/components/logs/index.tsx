'use client'

import { type LogRecord, type LogType } from "@lib/types/logger";
import style from './index.module.scss';
import Log from "../log";
import { motion } from "framer-motion";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef, useState } from "react";

interface LogsProps {
  logs: LogRecord[];
  type: LogType;  
}

export default function Logs({ type, logs }: LogsProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const filteredLogs = logs.filter(log => type === "all" || log.type === type).reverse();
  const [latestSeenUUID, setLatestSeenUUID] = useState<string>("");

  const rowVirtualizer = useVirtualizer({
    count: filteredLogs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
    enabled: true,
  });

  const lastIndex = type === "all" 
    ? 0 
    : filteredLogs.indexOf(filteredLogs.filter(log => log.type === type)[0]);

  const items = rowVirtualizer.getVirtualItems();

  return (
    <div 
      ref={parentRef} 
      className={style.logs} 
      role="list"
    >
      <div
        className={style.logsContainer}
        style={{
          height: rowVirtualizer.getTotalSize(),
        }}
      >
        <div className={style.transform} style={{ transform: `translateY(${items[0]?.start ?? 0}px)` }}>
            {items.map((virtualRow) => {
              const log = filteredLogs[virtualRow.index];
              const isLast = virtualRow.index === filteredLogs.length - 1;
              const isNew = virtualRow.index === lastIndex;
              
              return (
                <motion.div
                  ref={rowVirtualizer.measureElement}
                  data-index={log.uuid}
                  key={log.uuid}
                  layout
                  initial={isNew && latestSeenUUID !== log.uuid ? { opacity: 0, x: 100 } : false}
                  animate={isNew && latestSeenUUID !== log.uuid ? { opacity: 1, x: 0 } : false}
                  transition={{ duration: 0.2 }}
                  onAnimationComplete={isNew && latestSeenUUID !== log.uuid ? () => { setLatestSeenUUID(log.uuid) } : undefined}
                >
                  <div>
                    <Log record={log} isNew={isNew} isLast={isLast} />
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
