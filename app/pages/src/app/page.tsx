'use client'

import style from './page.module.scss';
import BootstrapClient from '@/components/bootstrapClient';
import { fetchConfig, fetchResources, fetchUrl, fetchVersion } from './page.server';
import Exam from './exam';
import NameForm from '@/components/nameForm';
import { useEffect, useRef, useState } from 'react';
import { Yamlconf } from '@/lib/types/yamlconf';
import LockScreen from '@/components/lockScreen';

const HEARTBEAT_INTERVAL = 5000;

export default function Page() {
  const [files, setFiles] = useState<string[]>([]);
  const [yamlconf, setYamlconf] = useState<Yamlconf>();
  const [version, setVersion] = useState<string>();
  const [locked, setLocked] = useState<boolean>(true);
  const [finished, setFinished] = useState<boolean>(false);
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const hasRun = useRef<boolean>(false);

  useEffect(() => {
    (async () => {
      setFiles(await fetchResources());
      setYamlconf(await fetchConfig());
      setVersion(await fetchVersion());
    })();
  }, []);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const connectToSse = async () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      try {
        const url = await fetchUrl();
        const es = new EventSource(`${url}/api/sse/student`);
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
          setLocked(data.message.locked);
          if (data.message.finished !== undefined) {
            setFinished(data.message.finished);
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
        locked || finished ? <LockScreen finished={!locked && finished} />
          :
          <div>
            <NameForm />
            <div className={`container ${style.main_content}`}>
              <iframe className={style.content_frame} src="/exam.html" width="100%"></iframe>
              <h1 className={style.h1}>Resources</h1>
              <ul className={style.file_list}>
                {
                  files.map((v, i) =>
                    <li key={i}>
                      <a href={`/api/resources/${v}`} download={v}>{v}</a>
                    </li>)
                }
              </ul>

              <h1 className={style.h1}>Upload</h1>
              {
                yamlconf?.enable && <p>{yamlconf?.label}</p>
              }
              <ul className={style.upload_file_list}>
                {
                  yamlconf?.studentsFiles && yamlconf.studentsFiles.map((v, i) =>
                    <li key={i}>{v}</li>
                  )
                }
              </ul>

              <Exam conf={yamlconf} />

              <div id="progressBarContainer">
                <div id="progressBar" className="notransition"></div>
              </div>

              <div className={`modal fade ${style.message_popup}`} tabIndex={-1} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content">
                    <div className={`modal-header justify-content-center ${style.message_popup_header}`}>
                      <div className="mx-auto">
                        <i className="bi bi-check-circle" id="messagePopupIcon" style={{fontSize: "5rem", color: "white"}}></i>
                      </div>
                      <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className={`modal-body ${style.message_popup_body}`}>
                      <p>Modal body text goes here.</p>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <BootstrapClient/>

            <footer className={style.footer} id="version">Version: {version}</footer>
          </div>
      }
    </>
  )
}
