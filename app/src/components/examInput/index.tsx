'use client'

import { ChangeEvent, useRef, useState } from 'react';
import style from './index.module.scss';
import { HardDriveUploadIcon, FileIcon, XIcon } from 'lucide-react';

export default function ExamInput() {
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChooseFile = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.currentTarget.files![0].name || ""); 
  }

  const handleDeleteFile = () => {
    setFileName("");
    fileInputRef.current!.value = "";
  }

  return (
    <fieldset className={style.field}>
        <h2>Upload Exam</h2>

        <label className={style.label}>
          <div className={style.text}>
            <HardDriveUploadIcon size={56} />
            Upload exam here
          </div>
          <input ref={fileInputRef} type='file' name='examFile' accept='.htm,.html' onChange={handleChooseFile} required/>
        </label>
      <div className={style.file_zone}>
        {
          fileName !== ""
            ?
            <article className={style.file}>
              <FileIcon />
              <p>{fileName}</p>
              <button className={style.delete} onClick={handleDeleteFile}>
                <XIcon />
              </button>
            </article>
            :
            <article className={style.no_file}>
              No files
            </article>
        }
      </div>
    </fieldset>
  )
}
