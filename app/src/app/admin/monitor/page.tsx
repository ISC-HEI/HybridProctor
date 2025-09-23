'use client'

import Logs from '@/components/logs';
import style from './page.module.scss';
import { useState } from 'react';
import { LogType } from '@/utils/logger';
import LogTypeChoice from '@/components/logTypeChoice';

export default function Monitor() {
  const [type, setType] = useState<LogType>("all");



  return (
    <main>
      <aside className={style.logs}>
        <LogTypeChoice onChoice={setType} />

        <Logs type={type} /> 
      </aside>
    </main>
  )
}
