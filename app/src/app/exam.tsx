'use client'

import 'bootstrap/dist/css/bootstrap.css';
import '@style/bootstrap-4.6.2.min.css';
import '@style/bootstrap-icons-1.11.3.min.css'

import { uploadFiles } from './page.server';
import { FormEvent, useRef, useState } from 'react';

import style from './exam.module.scss';
import { Yamlconf } from '@/lib/types/yamlconf';
import { useNotifications } from '@/lib/utils/hooks/useNotifications';

interface ExamProps {
  conf: Yamlconf|undefined;
}

export default function Exam({ conf }: ExamProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const addNotification = useNotifications().addNotification;

  const handleChooseFiles = () => {
    const newFiles: File[] = [];

    if (!fileInputRef.current || !fileInputRef.current.files) return;

    for (const file of fileInputRef.current.files) {
      newFiles.push(file);
    }

    setFiles(newFiles);
  }

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();
    
    const state = await uploadFiles(files);
    
    addNotification({ success: state.ok, text: state.message, infinite: false }); 
  } 

  return (
    <>
      <form className={style.form} onSubmit={handleSubmit}>
        {
          conf && conf.enable &&
            <div className={`input-group`}>
              <label htmlFor='fileslabel'>Select files</label>
              <input name='files' id='files' type="file" multiple onChange={handleChooseFiles} ref={fileInputRef} />
            </div>
        }
        <button className={`submit-btn ${style.submit_btn} btn-primary`} disabled={!conf} type='submit'>{conf && conf.enable ? "Upload" : "Finish"}</button>
      </form>
    </>
  )
}
