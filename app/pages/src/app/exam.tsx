'use client'

import 'bootstrap/dist/css/bootstrap.css';
import '@style/bootstrap-4.6.2.min.css';
import '@style/bootstrap-icons-1.11.3.min.css'

import { FormEvent, useRef, useState } from 'react';

import style from './exam.module.scss';
import { Yamlconf } from '@/lib/types/yamlconf';
import { useNotifications } from '@/lib/utils/hooks/useNotifications';
import Loader from '@/components/loader';
import HashDialog from '@/components/hashDialog';
import ValidateHash from '@/components/validateHash';

interface ExamProps {
  conf: Yamlconf|undefined;
}

export default function Exam({ conf }: ExamProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const addNotification = useNotifications().addNotification;
  const [loading, setLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [showHash, setShowHash] = useState<boolean>(false);
  const [showValidate, setShowValidate] = useState<boolean>(false);

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
    
    setLoading(true);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/upload/files', {
        method: 'POST',
        body: formData,
      });

      const state = await response.json();

      addNotification({ success: state.ok, text: state.message, infinite: false });

      if (state.ok) {
        setHash(state.hash);
        setShowHash(true);
      }
    } catch (error) {
      console.error('File upload failed:', error);
      addNotification({ success: false, text: 'File upload failed.', infinite: false });
    } finally {
      setLoading(false);
    }
  }

  const handleShowValidate = () => {
    setShowValidate(true);
  }

  return (
    <>
      <HashDialog hash={hash} show={showHash} onClose={() => setShowHash(false)} />
      <ValidateHash show={showValidate} onClose={() => setShowValidate(false)} />
      <form className={style.form} onSubmit={handleSubmit}>
        {
          conf && conf.enable &&
            <div className={`input-group`}>
              <label htmlFor='fileslabel'>Select files</label>
              <input name='files' id='files' type="file" multiple onChange={handleChooseFiles} ref={fileInputRef} />
            </div>
        }
        <button className={`submit-btn ${style.submit_btn} btn-primary`} disabled={!conf || ( conf.enable && files.length < 1 ) } type='submit'>
          { loading
            ? <Loader light />
            : conf && conf.enable ? "Upload" : "Finish"
          }
        </button>
      </form>
      { conf && conf.enable &&
        <button className={style.end_btn} disabled={!conf} onClick={handleShowValidate}>
          { loading
            ? <Loader light />
            : "Validate and finish"
          }
        </button>
      }
    </>
  )
}
