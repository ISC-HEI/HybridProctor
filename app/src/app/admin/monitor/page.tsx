'use client'

import Logs from '@/components/logs';
import style from './page.module.scss';
import { useEffect, useState } from 'react';
import { LogRecord, type LogType } from '@services/logger';
import LogTypeChoice from '@/components/logTypeChoice';
import { fetchUrl } from './page.server';
import { Student, StudentUpdate } from '@/lib/types/student';
import StudentsTable from '@/components/studentsTable';

export default function Monitor() {
  const [type, setType] = useState<LogType>("all");
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const [students, setStudents] = useState<Map<string, Student>>(new Map());

  useEffect(() => {
    let eventSource: EventSource;

    (async () => {
      const url = await fetchUrl();
      eventSource = new EventSource(`${url}/api/sse`);

      eventSource.addEventListener("log", async (evt) => {
        const data = await JSON.parse(evt.data) as { message: LogRecord[] };
        

        setLogs(prevLogs => {
          const set = new Set(prevLogs);
          
          for (const log of data.message) {
            set.add(log);
          }

          return [...set];
        });
      })

      eventSource.addEventListener("state", async (evt) => {
        const data = await JSON.parse(evt.data) as { message: StudentUpdate[] };

        setStudents(prevStudents => {
          const tempStudents: Map<string, Student> = new Map(prevStudents);

          for (const studentUpdate of data.message) {
            if (!prevStudents.has(studentUpdate.ip)) {
              tempStudents.set(studentUpdate.ip, studentUpdate as Student);
              continue;
            }

            tempStudents.set(studentUpdate.ip, { ...prevStudents.get(studentUpdate.ip) as Student, ...studentUpdate });
          }

          return tempStudents;
        });
      });

      window.onbeforeunload = () => {
        eventSource.close();
      };
    })();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return (
    <div className={style.page}>
      <aside className={style.logs}>
        <LogTypeChoice onChoice={setType} />

        <Logs logs={logs} type={type} />
      </aside>

      <main className={style.main}>
        <div className={style.tableContainer}>
          <StudentsTable students={students} />
        </div>
      </main>
    </div>
  )
}
