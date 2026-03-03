'use client'

import { ChangeEvent, DragEvent, FormEvent, useContext, useRef, useState, useTransition } from 'react';
import style from './index.module.scss';
import { HardDriveUploadIcon, FileIcon, XIcon } from 'lucide-react';
import FormButtons from '@components/formButtons';
import { StepContext } from '@/lib/utils/hooks/stepContext';
import { formatSize } from '@/lib/utils/file';

export default function ExamForm() {
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);

  const stepContext = useContext(StepContext);

  const handleChooseFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      setFileName(e.currentTarget.files[0].name);
    }
  }

  const handleDeleteFile = () => {
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      return alert("Upload failed, please retry.");
    }
    
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append('examFile', file);

        const response = await fetch('/api/upload/exam', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        stepContext?.setStep(stepContext.step + 1);
      }
      catch (err) {
        alert("Echec de l'upload veuillez réessayer");
      }
    });
  }

  const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
      }
      setFileName(e.dataTransfer.files[0].name);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={style.form}>
    <fieldset className={style.field}>
        <h2 className={style.title}>Upload Exam</h2>

        <label
          className={`${style.label} ${isDragging ? style.dragging : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className={style.text}>
            <HardDriveUploadIcon className={style.uploadIcon} size={56} />
            Upload exam here
          </div>
          <input ref={fileInputRef} type="file" name="examFile" accept=".htm,.html" onChange={handleChooseFile} required/>
        </label>
      <div className={style.file_zone}>
        {
          fileName !== "" && fileInputRef.current?.files?.length !== 0
            ?
            <article className={style.file}>
              <div className={style.text}>
                <div className={style.name}>
                  <FileIcon className={style.icon}/>
                  <p><strong>{fileName}</strong></p>
                </div>
                {fileInputRef.current!.files![0] && <p className={style.size}>{formatSize(fileInputRef.current!.files![0].size)}</p>}
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

    <FormButtons disabled={fileName === ""} loading={isPending}/>
    </form>
  )
}
