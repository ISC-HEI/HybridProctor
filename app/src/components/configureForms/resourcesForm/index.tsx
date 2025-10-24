'use client'

import { FormEvent, MouseEvent, useRef, useState, useTransition } from 'react';
import style from './index.module.scss';
import { HardDriveUploadIcon, FileIcon, XIcon } from 'lucide-react';
import { uploadResources } from './index.server';
import FormButtons from '@components/formButtons';
import { formatSize } from '@/lib/utils/file';
import { useRouter } from 'next/navigation';

export default function ExamForm() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleChooseFiles = () => {
    const newFiles: File[] = [];

    if (!fileInputRef.current || !fileInputRef.current.files) return;

    for (const file of fileInputRef.current.files) {
      newFiles.push(file);
    }

    setFiles(newFiles);
  }

  const handleDeleteFile = (evt: MouseEvent) => {
    evt.preventDefault();

    setFiles(files.filter(v => v.name !== evt.currentTarget.id));
  }

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!fileInputRef.current?.files?.[0]) {
      return alert("Please upload a file.");
    }
    
    startTransition(async () => {
      try {
        await uploadResources(files);
        
        router.push("/admin/monitor");
      }
      catch (err) {
        alert("Upload failed, please retry.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className={style.form}>
    <fieldset className={style.field}>
        <h2 className={style.title}>Upload resources to be download by students</h2>

        <label className={style.label}>
          <div className={style.text}>
            <HardDriveUploadIcon className={style.uploadIcon} size={56} />
            Upload resources here
          </div>
          <input ref={fileInputRef} type="file" name="resourcesFiles" onChange={handleChooseFiles} multiple required/>
        </label>
      <ul className={style.file_zone}>
        {
          files.length > 0
            ?
            files.map(
                (file, idx) =>
                  <article key={idx} className={style.file}>
                    <div className={style.text}>
                      <div className={style.name}>
                        <FileIcon className={style.icon}/>
                        <p><strong>{file.name}</strong></p>
                      </div>
                      <p className={style.size}>{formatSize(fileInputRef.current!.files![0].size)}</p>
                    </div>
                    
                    <button className={style.delete} onClick={handleDeleteFile}>
                      <XIcon size={16}/>
                    </button>
                  </article>
              )
              :
              <article className={style.noFiles}>
                No files
              </article>
          }
        </ul>
      </fieldset>

      <FormButtons disabled={fileInputRef.current?.value === "" || files.length === 0} loading={isPending}/>
    </form>
  )
}
