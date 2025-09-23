'use client'

import BootstrapClient from '@/components/bootstrapClient';

import { fetchConfig, fetchResources, fetchVersion, uploadFiles } from './page.server';
import { useActionState, useEffect, useRef, useState } from 'react';
import { Yamlconf } from '@/utils/types/yamlconf';
import NameForm from '@/components/nameForm';
import { nameInDb } from '@/utils/dbHelpers';

import style from './page.module.scss';

export default function Page() {
  const [files, setFiles] = useState<string[]>([]);
  const [yamlconf, setYamlconf] = useState<Yamlconf>();
  const [version, setVersion] = useState<string>();
  const nameFormRef = useRef<HTMLDialogElement>(null);

  const [state, formAction] = useActionState(uploadFiles, { ok: true, message: "" });

  useEffect(() => {(
    async () => {
      setFiles(await fetchResources());
      setYamlconf(await fetchConfig());
      setVersion(await fetchVersion());

      const name = localStorage.getItem("name");

      if (!name || !await nameInDb(name)) {
        nameFormRef.current!.show();
      }
    }
  )()}, []);

  return (
    <>
      <NameForm ref={nameFormRef} />
      <div className={`container ${style.main_content}`}>
        <iframe className={style.content_frame} src="exam.html" width="100%"></iframe>


        <h1 className={style.h1}>Resources</h1>
        <ul className={style.file_list}>
          {
            files.map((v, i) =>
              <li key={i}>
                <a href={`/resources/${v}`} download={v}>{v}</a>
              </li>)
          }
        </ul>

        <h1 className={style.h1}>Upload</h1>
        {
          yamlconf?.enable && <p>{yamlconf?.description}</p>
        }
        <ul className={style.upload_file_list}>
          {
            yamlconf?.files && yamlconf.files.map((v, i) =>
            <li key={i}>{v}</li>
            )
          }
        </ul>

        <form className={style.form} action={formAction}>
          <div className={`input-group`}>
            <label htmlFor='fileslabel'>Select files</label>
            <input name='files' id='files' type="file" multiple />
          </div>
          <input type="hidden"/>
          <p className={`status-${state.ok ? "success" : "error"}`}>{state.message}</p>
          <button className={`submit-btn ${style.submit_btn} btn-primary`} type='submit'>Upload</button>
        </form>
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

        <footer className={style.footer} id="version">{version}</footer>
      </div>
      <BootstrapClient/>
    </>
  )
}
