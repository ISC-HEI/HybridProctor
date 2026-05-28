import style from './index.module.scss';
import Exam from "@components/exam";
import NameForm from '@components/nameForm';
import { useEffect, useRef } from 'preact/hooks';
import { type Yamlconf } from '@srvtypes/yamlconf';
import LockScreen from '@components/lockScreen';
import { useSignal } from '@preact/signals';

const HEARTBEAT_INTERVAL = 5000;

export default function ExamPage() {
  const files = useSignal<string[]>([]);
  const yamlconf = useSignal<Yamlconf>();
  const version = useSignal<string>();
  const locked = useSignal<boolean>(true);
  const finished = useSignal<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    (async () => {
      files.value = await (await fetch("/api/fetch/resources")).json();
      yamlconf.value = await (await fetch("/api/fetch/config")).json();
      version.value = await (await fetch("/api/fetch/version")).text();
    })();
  }, []);

  useEffect(() => {
    const connectToSse = async () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      try {
        const es = new EventSource("/api/sse/student");
        eventSourceRef.current = es;

        window.onbeforeunload = () => {
          es.close()
          eventSourceRef.current = null;
        }

        es.onopen = () => {
          console.log("SSE connection established.");
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };

        es.addEventListener("init", (evt) => {
          console.log("SSE connection initialized:", evt.data);
        });

        es.addEventListener("std", (evt) => {
          const data = JSON.parse(evt.data) as { message: { locked: boolean, finished?: boolean } };
          locked.value = data.message.locked;
          if (data.message.finished !== undefined) {
            finished.value = data.message.finished;
          }
        });

        es.addEventListener("error", (evt: MessageEvent) => {
          console.error("SSE error:", evt.data);
        });

        es.onerror = (err: Event & { message?: string }) => {
          console.error("EventSource failed:", err.message || err);
          es.close();
          if (!reconnectTimeoutRef.current) {
            reconnectTimeoutRef.current = setTimeout(connectToSse, 2000);
          }
        };
      } catch (error) {
        console.error("Failed to fetch SSE URL and connect:", error);
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

  useEffect(() => {
    const sendHeartbeat = async () => {
      try {
        await fetch('/api/heartbeat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Failed to send heartbeat:', error);
      }
    };

    sendHeartbeat();
    const intervalId = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, []);


  return (
    <>
      {
        locked.value || finished.value ? <LockScreen finished={!locked.value && finished.value} />
          :
          <div>
            <NameForm />
            <div className={style.main_content}>
              <iframe id="content_frame" className={style.content_frame} src="/exam.html" width="100%"></iframe>
              <h1 className={style.h1}>Resources</h1>
              <ul id="resources_list" className={style.file_list}>
                {
                  files.value.map((v, i) =>
                    <li key={i}>
                      <a href={`/api/resources/${v}`} download={v}>{v}</a>
                    </li>)
                }
              </ul>

              <h1 className={style.h1}>Upload</h1>
              {
                yamlconf.value?.enable && <p>{yamlconf.value?.label}</p>
              }
              <ul id="upload_file_list" className={style.upload_file_list}>
                {
                  yamlconf.value?.studentsFiles && yamlconf.value.studentsFiles.map((v, i) =>
                    <li key={i}>- {v}</li>
                  )
                }
              </ul>

              <Exam conf={yamlconf.value} />
            </div>

            <footer className={style.footer} id="version">Version: {version}</footer>
          </div>
      }
    </>
  )
}
