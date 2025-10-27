'use client'

import { useRelativeTime } from "@/lib/utils/hooks/useRelativeTime";
import { LogRecord } from "@services/logger";
import { motion } from "motion/react";

import style from "./index.module.scss"

interface LogProps {
  record: LogRecord;
  isNew: boolean;
}

export default function Log({ record, isNew }: LogProps) {
  const relative = useRelativeTime(record.timestamp);

  return (
    <motion.li 
      layout initial={{ opacity: 0, right: "-80%" }} animate={{ opacity: 1, right: 0 }} exit={{ opacity: 0, right: "-80%" }}
      className={`${style.record} ${isNew ? style.new : ''}`}
    >
      <div className={style.type}>
        <span>{record.type[0].toUpperCase()}</span>
      </div>
      <div className={style.content}>
        {record.issuer &&
          <p><strong>{record.issuer}</strong> {record.action} <span><span className={style.bullet}></span> {relative}</span></p>
        }
        <p>{record.message} {!record.issuer && (<span><span className={style.bullet}></span> {relative}</span>)}</p>
      </div>
    </motion.li>
  )
}
