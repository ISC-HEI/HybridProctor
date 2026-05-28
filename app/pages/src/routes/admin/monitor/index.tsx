import Logs from '@/components/logs';
import style from './index.module.scss';
import { useEffect, useRef} from 'preact/hooks';
import { type LogRecord, type LogType } from '@srvtypes/logger';
import LogTypeChoice from '@/components/logTypeChoice';
import type { Student, StudentUpdate } from '@srvtypes/student';
import StudentsTable from '@/components/studentsTable';
import Loader from '@/components/loader';
import Goto from '@/components/goto';
import { CogIcon } from 'lucide-preact';
import MonitorInfos from '@/components/monitorInfos';
import { useSignal } from '@preact/signals';

export default function Monitor() {
  const type = useSignal<LogType>("all");
  const logs = useSignal<LogRecord[]>([]);
  const students = useSignal<Map<string, Student>>(new Map());
  const connected = useSignal<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    const connectToSse = async () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      try {
        const es = new EventSource("/api/sse/admin");
        eventSourceRef.current = es;

        window.onbeforeunload = () => {
          es.close()
          eventSourceRef.current = null;
        }

        es.onopen = () => {
          console.log("SSE connection established.");
          connected.value = true;
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };

        es.addEventListener("init", (evt) => {
          const data = JSON.parse(evt.data) as { message: Student[] };
          students.value = new Map(data.message.map(student => [student.ip, student]));
        });

        es.addEventListener("log", (evt) => {
          const data = JSON.parse(evt.data) as { message: LogRecord[] };
          logs.value = [...logs.value, ...data.message];
        });

        es.addEventListener("state", (evt) => {
          const data = JSON.parse(evt.data) as { message: StudentUpdate[] };
  
          const tempStudents = new Map(students.value);
          for (const studentUpdate of data.message) {
            const existing = tempStudents.get(studentUpdate.ip);
            tempStudents.set(studentUpdate.ip, { ...existing, ...studentUpdate } as Student);
          }

          students.value = tempStudents;
        });

        es.addEventListener("error", (evt: MessageEvent) => {
          const data = JSON.parse(evt.data) as { message: string };
          if (data.message === "Unauthorized") {
            navigation.navigate("/admin/auth");
          }
        });

        es.onerror = (err: Event & { message?: string }) => {
          console.error("EventSource failed:", err.message || err);
          connected.value = false;
          es.close();
          if (!reconnectTimeoutRef.current) {
            reconnectTimeoutRef.current = setTimeout(connectToSse, 2000);
          }
        };
      } catch (error) {
        console.error("Failed to fetch SSE URL and connect:", error);
        connected.value = false;
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
  }, []);

  return (
    <div className={style.page}>
      <Goto href="/admin/configure" Icon={CogIcon} />
      <aside className={style.logs}>
        <LogTypeChoice onChoice={(v: LogType) => type.value = v} />
        { !connected && <div style={{ color: 'red', padding: '1em' }}>Reconnecting...</div> }
        { logs.value.length === 0 && connected
          ? <Loader />
          : <Logs logs={logs} type={type} />
        }
      </aside>

      <main className={style.main}>
        { students.value.size === 0 && connected
          ? <Loader />
          : 
          <div className={style.tableContainer}>
            <StudentsTable students={students} />
          </div>
        }

        <MonitorInfos connected={[...students.value.values()].filter(student => student.connected).length} total={students.value.size} />
      </main>
    </div>
  )
}
