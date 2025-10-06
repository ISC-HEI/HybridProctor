'use client'

import 'bootstrap/dist/css/bootstrap.css';
import '@style/bootstrap-4.6.2.min.css';
import '@style/bootstrap-icons-1.11.3.min.css'

import { uploadFiles } from './page.server';
import { useActionState } from 'react';

import style from './exam.module.scss';

export default function Page() {
  const [state, formAction] = useActionState(uploadFiles, { ok: true, message: "" });

  return (
    <>
      <form className={style.form} action={formAction}>
        <div className={`input-group`}>
          <label htmlFor='fileslabel'>Select files</label>
          <input name='files' id='files' type="file" multiple />
        </div>
        <input type="hidden"/>
        <p className={`status-${state.ok ? "success" : "error"}`}>{state.message}</p>
        <button className={`submit-btn ${style.submit_btn} btn-primary`} type='submit'>Upload</button>
      </form>
   </>
  )
}
