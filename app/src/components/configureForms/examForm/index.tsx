'use client'

import { ChangeEvent, FormEvent, useContext, useRef, useState, useTransition } from 'react';
import style from './index.module.scss';
import { HardDriveUploadIcon, FileIcon, XIcon } from 'lucide-react';
import { uploadExam } from './index.server';
import FormButtons from '@components/formButtons';
import { StepContext } from '@/lib/utils/hooks/stepContext';
import { formatSize } from '@/lib/utils/file';

export default function ExamForm() {
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const stepContext = useContext(StepContext);

  const handleChooseFile = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.currentTarget.files![0].name || "");
  }

  const handleDeleteFile = () => {
    setFileName("");
    fileInputRef.current!.value = "";
  }

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!fileInputRef.current?.files?.[0]) {
      return alert("Upload failed, please retry.");
    }
    
    startTransition(async () => {
      try {
        await uploadExam(fileInputRef.current!.files![0]);
        
        stepContext?.setStep(stepContext.step + 1);
      }
      catch (err) {
        alert("Echec de l'upload veuillez réessayer");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className={style.form}>
    <fieldset className={style.field}>
        <h2 className={style.title}>Upload Exam</h2>

        <label className={style.label}>
          <div className={style.text}>
            <HardDriveUploadIcon className={style.uploadIcon} size={56} />
            Upload exam here
          </div>
          <input ref={fileInputRef} type="file" name="examFile" accept=".htm,.html" onChange={handleChooseFile} required/>
        </label>
      <div className={style.file_zone}>
        {
          fileName !== ""
            ?
            <article className={style.file}>
              <div className={style.text}>
                <div className={style.name}>
                  <FileIcon className={style.icon}/>
                  <p><strong>{fileName}</strong></p>
                </div>
                <p className={style.size}>{formatSize(fileInputRef.current!.files![0].size)}</p>
              </div>

              <button className={style.delete} onClick={handleDeleteFile}>
                <XIcon size={16}/>
              </button>
            </article>
            :
            <article className={style.no_file}>
              No files
            </article>
        }
      </div>
    </fieldset>

    <FormButtons disabled={fileInputRef.current?.value === "" || fileName === ""} loading={isPending}/>
    </form>
  )
}
