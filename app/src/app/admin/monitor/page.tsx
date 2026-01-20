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
import { useRouter } from 'next/navigation';

export default function Monitor() {
  const [type, setType] = useState<LogType>("all");
  const [logs, setLogs] = useState<LogRecord[]>([]);
  const [students, setStudents] = useState<Map<string, Student>>(new Map());
  const [connected, setConnected] = useState<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  
  const hasRun = useRef<boolean>(false);


  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const connectToSse = async () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      try {
        const url = await fetchUrl();
        const es = new EventSource(`${url}/api/sse/admin`);
        eventSourceRef.current = es;

        window.onbeforeunload = () => {
          es.close()
          eventSourceRef.current = null;
        }

        es.onopen = () => {
          console.log("SSE connection established.");
          setConnected(true);
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };

        es.addEventListener("init", (evt) => {
          console.log("SSE connection initialized:", evt.data);
        });

        es.addEventListener("log", (evt) => {
          const data = JSON.parse(evt.data) as { message: LogRecord[] };
          setLogs(prevLogs => [...prevLogs, ...data.message]);
        });

        es.addEventListener("state", (evt) => {
          const data = JSON.parse(evt.data) as { message: StudentUpdate[] };
          setStudents(prevStudents => {
            const tempStudents = new Map(prevStudents);
            for (const studentUpdate of data.message) {
              const existing = tempStudents.get(studentUpdate.ip);
              tempStudents.set(studentUpdate.ip, { ...existing, ...studentUpdate } as Student);
            }
            return tempStudents;
          });
        });

        es.addEventListener("error", (evt: MessageEvent) => {
          const data = JSON.parse(evt.data) as { message: string };
          if (data.message === "Unauthorized") {
            router.push("/admin/auth");
          }
        });

        es.onerror = (err: Event & { message?: string }) => {
          console.error("EventSource failed:", err.message || err);
          setConnected(false);
          es.close();
          if (!reconnectTimeoutRef.current) {
            reconnectTimeoutRef.current = setTimeout(connectToSse, 2000);
          }
        };
      } catch (error) {
        console.error("Failed to fetch SSE URL and connect:", error);
        setConnected(false);
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(connectToSse, 2000);
        }
      }
    };

    connectToSse();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [router]);

  return (
    <div className={style.page}>
      <Goto href="/admin/configure" Icon={CogIcon} />
      <aside className={style.logs}>
        <LogTypeChoice onChoice={setType} />
        { !connected && <div style={{ color: 'red', padding: '1em' }}>Reconnecting...</div> }
        { logs.length === 0 && connected
          ? <Loader />
          : <Logs logs={logs} type={type} />
        }
      </aside>

      <main className={style.main}>
        { students.size === 0 && connected
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
