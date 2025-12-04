'use client'

import Logs from '@/components/logs';
import style from './page.module.scss';
import { useEffect, useRef, useState } from 'react';
import { LogRecord, type LogType } from '@services/logger';
import LogTypeChoice from '@/components/logTypeChoice';
import { fetchUrl } from './page.server';
import { Student, StudentUpdate } from '@/lib/types/student';
import StudentsTable from '@/components/studentsTable';
import Loader from '@/components/loader';
import Goto from '@/components/goto';
import { CogIcon } from 'lucide-react';
import MonitorInfos from '@/components/monitorInfos';

export default function Monitor() {
  const [type, setType] = useState<LogType>("all");
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const [students, setStudents] = useState<Map<string, Student>>(new Map());

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    let eventSource: EventSource;

    (async () => {
      const url = await fetchUrl();
      eventSource = new EventSource(`${url}/api/sse`);

      eventSource.addEventListener("open", async (evt) => {
        console.log("Connected");
      })

      eventSource.addEventListener("log", (evt) => {
        const data = JSON.parse(evt.data) as { message: LogRecord[] };

        // This is much more efficient than creating a Set from the entire
        // previous state on every update.
        setLogs(prevLogs => [...prevLogs, ...data.message]);
      })

      eventSource.addEventListener("state", (evt) => {
        const data = JSON.parse(evt.data) as { message: StudentUpdate[] };

        setStudents(prevStudents => {
          const tempStudents = new Map(prevStudents);

          for (const studentUpdate of data.message) {
            const existing = tempStudents.get(studentUpdate.ip);
            // This correctly creates a new student entry or merges with an existing one.
            tempStudents.set(studentUpdate.ip, { ...existing, ...studentUpdate } as Student);
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
      <Goto href="/admin/configure" Icon={CogIcon} />
      <aside className={style.logs}>
        <LogTypeChoice onChoice={setType} />
        { logs.length == 0
          ? <Loader />
          : <Logs logs={logs} type={type} />
        }

      </aside>

      <main className={style.main}>
        { students.size == 0
          ? <Loader />
          :
          <div className={style.tableContainer}>
            <StudentsTable students={students} />
          </div>
        }
        
        <MonitorInfos connected={[...students.values()].filter(student => student.connected).length} total={students.size} />
      </main>
    </div>
  )
}
