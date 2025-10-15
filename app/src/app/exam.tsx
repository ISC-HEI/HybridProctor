'use client'

import 'bootstrap/dist/css/bootstrap.css';
import '@style/bootstrap-4.6.2.min.css';
import '@style/bootstrap-icons-1.11.3.min.css'

import { uploadFiles } from './page.server';
import { useActionState, useState } from 'react';

import style from './exam.module.scss';
import { Yamlconf } from '@/lib/types/yamlconf';

interface ExamProps {
  conf: Yamlconf|undefined;
}

export default function Exam({ conf }: ExamProps) {
  const [state, formAction] = useActionState(uploadFiles, { ok: true, message: "" });
  const [fileCount, setFileCount] = useState<number>(0);

  return (
    <>
      <form className={style.form} action={formAction}>
        {
          conf && conf.files.length !== 0 &&
            <div className={`input-group`}>
              <label htmlFor='fileslabel'>Select files</label>
              <input name='files' id='files' type="file" multiple onChange={evt => setFileCount(evt.currentTarget.files?.length ? evt.currentTarget.files.length : 0)} />
            </div>
        }
        <p className={`status-${state.ok ? "success" : "error"}`}>{state.message}</p>
        <button className={`submit-btn ${style.submit_btn} btn-primary`} disabled={!conf || fileCount < conf.files.length} type='submit'>{conf?.files.length !== 0 ? "Upload" : "Finish"}</button>
      </form>
    </>
  )
}
