'use client'

import { useRelativeTime } from "@/lib/utils/hooks/useRelativeTime";
import { LogRecord } from "@services/logger";

import style from "./index.module.scss"

interface LogProps {
  record: LogRecord;
  isNew: boolean;
  isLast: boolean;
}

export default function Log({ record, isNew, isLast }: LogProps) {
  const relative = useRelativeTime(record.timestamp);

  let displayIssuer = record.issuer;
  if (record.issuer && record.issuer.split(' ').length > 2) {
    displayIssuer = record.issuer.split(' ').slice(0, 2).join(' ');
  }

  return (
    <li className={`${style.record} ${isNew ? style.new : ''} ${isLast ? style.last : ''}`}>
      <div className={style.type}>
        <span>{record.type[0].toUpperCase()}</span>
      </div>
      <div className={style.content}>
        {record.issuer &&
          <p><strong>{displayIssuer}</strong> {record.action} <span><span className={style.bullet}></span> {relative}</span></p>
        }
        <p>{record.message} {!record.issuer && (<span><span className={style.bullet}></span> {relative}</span>)}</p>
      </div>
    </li>
  )
}
