'use client'

import { ChangeEvent, DragEvent, FormEvent, MouseEvent, useRef, useState, useTransition } from 'react';
import style from './index.module.scss';
import { HardDriveUploadIcon, FileIcon, XIcon } from 'lucide-react';

import FormButtons from '@components/formButtons';
import { formatSize } from '@/lib/utils/file';
import { useRouter } from 'next/navigation';

export default function ResourcesForm() {
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  const updateFileList = (newFiles: File[]) => {
    setFiles(newFiles);
    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));
    if (fileInputRef.current) {
        fileInputRef.current.files = dataTransfer.files;
    }
  }

  const addFiles = (newFiles: FileList) => {
    const filesArr = Array.from(newFiles);
    const newFilesToAdd = filesArr.filter(newFile => !files.some(existingFile => existingFile.name === newFile.name));
    updateFileList([...files, ...newFilesToAdd]);
  }

  const handleChooseFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
        addFiles(e.currentTarget.files);
    }
  }

  const handleDeleteFile = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    const fileName = evt.currentTarget.id;
    const newFiles = files.filter(v => v.name !== fileName);
    updateFileList(newFiles);
  }

  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (files.length === 0) {
      return alert("Please upload at least one file.");
    }
    
    startTransition(async () => {
      try {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('resourcesFiles', file);
        });

        const response = await fetch('/api/upload/resources', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        router.push("/admin/monitor");
      }
      catch (err) {
        alert("Upload failed, please retry.");
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
        addFiles(e.dataTransfer.files);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={style.form}>
    <fieldset className={style.field}>
        <h2 className={style.title}>Upload resources to be download by students</h2>

        <label
          className={`${style.label} ${isDragging ? style.dragging : ''}`}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className={style.text}>
            <HardDriveUploadIcon className={style.uploadIcon} size={56} />
            Upload resources here
          </div>
          <input ref={fileInputRef} type="file" name="resourcesFiles" onChange={handleChooseFiles} multiple />
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
                      <p className={style.size}>{formatSize(file.size)}</p>
                    </div>
                    
                    <button id={file.name} className={style.delete} onClick={handleDeleteFile}>
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

      <FormButtons disabled={files.length === 0} loading={isPending}/>
    </form>
  )
}
