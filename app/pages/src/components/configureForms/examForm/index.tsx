import style from './index.module.scss';
import { HardDriveUploadIcon, FileIcon, XIcon } from 'lucide-preact';
import FormButtons from '@components/formButtons';
import { formatSize } from '@srvutils/file';
import { useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import type { TargetedDragEvent, TargetedEvent } from 'preact';
import { nextStep } from '@/lib/utils/signals/configure';

export default function ExamForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileName = useSignal<string>("");
  const isPending = useSignal<boolean>(false);
  const isDragging = useSignal<boolean>(false);

  const handleChooseFile = (e: TargetedEvent<HTMLInputElement>) => {
    if (e.currentTarget.files && e.currentTarget.files.length > 0) {
      fileName.value = e.currentTarget.files[0].name;
    }
  }

  const handleDeleteFile = () => {
    fileName.value = "";
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  const handleSubmit = async (evt: TargetedEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      return alert("Upload failed, please retry.");
    }

    isPending.value = true;
    
    try {
      const formData = new FormData();
      formData.append('exam', file);

      const response = await fetch('/api/upload/exam', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      nextStep();
    }
    catch (err) {
      alert("Echec de l'upload veuillez réessayer");
    }
    finally {
      isPending.value = false;
    }
  }

  const handleDragEnter = (e: TargetedDragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    isDragging.value = true;
  };

  const handleDragLeave = (e: TargetedDragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    isDragging.value = false;
  };

  const handleDragOver = (e: TargetedDragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: TargetedDragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    isDragging.value = false;

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      if (fileInputRef.current) {
        fileInputRef.current.files = e.dataTransfer.files;
      }

      fileName.value = e.dataTransfer.files[0].name;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      <fieldset className={style.field}>
        <h2 id="title" className={style.title}>Upload Exam</h2>

        <label className={`${style.label} ${isDragging ? style.dragging : ''}`} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
          <div className={style.text}>
            <HardDriveUploadIcon className={style.uploadIcon} size={56} />
            Upload exam here
          </div>

          <input id="exam_file" ref={fileInputRef} type="file" name="examFile" accept=".htm,.html" onChange={handleChooseFile} required/>
        </label>

        <div className={style.file_zone}>
        {
          fileName.value !== "" && fileInputRef.current?.files?.length !== 0
            ?
            <article className={style.file}>
              <div className={style.text}>
                <div className={style.name}>
                  <FileIcon className={style.icon}/>
                  <p><strong id="file_name">{fileName}</strong></p>
                </div>

                {fileInputRef.current!.files![0] && <p id="file_size" className={style.size}>{formatSize(fileInputRef.current!.files![0].size)}</p>}
              </div>

              <button id="delete_btn" className={style.delete} onClick={handleDeleteFile}>
                <XIcon size={16}/>
              </button>
            </article>
            :
            <article id="no_file" className={style.no_file}>
              No files
            </article>
          }
          </div>
      </fieldset>

      <FormButtons disabled={fileName.value === ""} loading={isPending}/>
    </form>
    )
  }
