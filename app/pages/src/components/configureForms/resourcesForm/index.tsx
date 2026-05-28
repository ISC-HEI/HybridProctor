import style from './index.module.scss';
import { HardDriveUploadIcon, FileIcon, XIcon } from 'lucide-preact';
import FormButtons from '@components/formButtons';
import { formatSize } from '@srvutils/file';
import { useRef } from 'preact/hooks';
import { useSignal } from '@preact/signals';
import type { TargetedEvent, TargetedMouseEvent, TargetedDragEvent } from 'preact';

export default function ResourcesForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const files = useSignal<File[]>([]);
  const isPending = useSignal<boolean>(false);
  const isDragging = useSignal<boolean>(false);

  const updateFileList = (newFiles: File[]) => {
    files.value = newFiles;

    const dataTransfer = new DataTransfer();
    newFiles.forEach(file => dataTransfer.items.add(file));

    if (fileInputRef.current) {
      fileInputRef.current.files = dataTransfer.files;
    }
  }

  const addFiles = (newFiles: FileList) => {
    const filesArr = Array.from(newFiles);
    const newFilesToAdd = filesArr.filter(newFile => !files.value.some(existingFile => existingFile.name === newFile.name));
    updateFileList([...files.value, ...newFilesToAdd]);
  }

  const handleChooseFiles = (e: TargetedEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
        addFiles(e.currentTarget.files);
    }
  }

  const handleDeleteFile = (evt: TargetedMouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    const fileName = evt.currentTarget.id;
    const newFiles = files.value.filter(v => v.name !== fileName);
    updateFileList(newFiles);
  }

  const handleSubmit = async (evt: TargetedEvent<HTMLFormElement>) => {
    evt.preventDefault();

    isPending.value = true;
    
    try {
      const formData = new FormData();
      files.value.forEach(file => {
        formData.append('resources', file);
      });

      const response = await fetch('/api/upload/resources', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      navigation.navigate("/admin/monitor");
    }
    catch (err) {
      alert("Upload failed, please retry.");
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
        addFiles(e.dataTransfer.files);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={style.form}>
    <fieldset className={style.field}>
        <h2 id="title" className={style.title}>Upload resources to be download by students</h2>

        <label className={`${style.label} ${isDragging ? style.dragging : ''}`} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
          <div className={style.text}>
            <HardDriveUploadIcon className={style.uploadIcon} size={56} />
            Upload resources here
          </div>
          <input id="resourcesFiles" ref={fileInputRef} type="file" name="resourcesFiles" onChange={handleChooseFiles} multiple />
        </label>
      <ul id="file_zone" className={style.file_zone}>
        {
          files.value.length > 0
            ?
            files.value.map(
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
              <article id="no_files" className={style.noFiles}>
                No files
              </article>
          }
        </ul>
      </fieldset>

      <FormButtons loading={isPending}/>
    </form>
  )
}
