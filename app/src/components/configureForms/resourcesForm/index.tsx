'use client'

import { ChangeEvent, FormEvent, useRef, useState, useTransition } from 'react';
import style from './index.module.scss';
import { HardDriveUploadIcon, FileIcon, XIcon } from 'lucide-react';
import { uploadResources } from './index.server';
import FormButtons from '@components/formButtons';
import { formatSize } from '@/lib/utils/file';
import { useRouter } from 'next/navigation';

export default function ExamForm() {
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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
      return alert("Please upload a file.");
    }
    
    startTransition(async () => {
      try {
        await uploadResources(fileInputRef.current!.files![0]);
        
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
        <h2 className={style.title}>Upload Resources</h2>

        <label className={style.label}>
          <div className={style.text}>
            <HardDriveUploadIcon className={style.uploadIcon} size={56} />
            Upload resources here (.zip)
          </div>
          <input ref={fileInputRef} type="file" name="resourcesFile" accept=".zip" onChange={handleChooseFile} required/>
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
