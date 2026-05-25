import type { Yamlconf } from "@srvtypes/yamlconf";
import { useRef } from "preact/hooks";
import HashDialog from "../hashDialog";
import ValidateHash from "../validateHash";
import Loader from "../loader";
import { addNotification } from "@utils/signals/notificationsStore";

import style from "./index.module.scss";
import { useSignal } from "@preact/signals";

interface ExamProps {
  conf: Yamlconf|undefined;
}

export default function Exam({ conf }: ExamProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const files = useSignal<File[]>([]);
  const loading = useSignal<boolean>(false);
  const hash = useSignal<string>("");
  const showValidate = useSignal<boolean>(false);

  const handleChooseFiles = () => {
    const newFiles: File[] = [];

    if (!fileInputRef.current || !fileInputRef.current.files) return;

    for (const file of fileInputRef.current.files) {
      newFiles.push(file);
    }

    files.value = newFiles;
  }

  const handleSubmit = async (evt: SubmitEvent) => {
    evt.preventDefault();
    evt.stopPropagation();

    loading.value = true;
    
    try {
      const formData = new FormData();
      files.value.forEach(file => {
        formData.append('files', file);
      });

      console.log(await (await fetch("/api/fetch/config")).json())

      const response = await fetch('/api/upload/files', {
        method: 'POST',
        body: formData,
      });

      console.log("ouias")

      const state = await response.json();

      addNotification({ success: state.ok, text: state.message, infinite: false });

      if (state.ok) {
        hash.value = state.hash
      }
    } catch (error) {
      console.error('File upload failed:', error);
      addNotification({ success: false, text: 'File upload failed.', infinite: false });
    } finally {
      loading.value = false
    }
  }

  const handleShowValidate = () => {
    showValidate.value = true;
  }

  return (
    <>
      <HashDialog hash={hash} onClose={() => hash.value = ""} />
      <ValidateHash show={showValidate} onClose={() => showValidate.value = false} />
      <form className={style.form} onSubmit={handleSubmit}>
        {
          conf && conf.enable &&
            <div className={`input-group`}>
              <label htmlFor='fileslabel'>Select files</label>
              <input name='files' id='files' type="file" multiple onChange={handleChooseFiles} ref={fileInputRef} />
            </div>
        }
        <button className={`submit-btn ${style.submit_btn} btn-primary`} disabled={!conf || ( conf.enable && files.value.length < 1 ) } type='submit'>
          { loading.value
            ? <Loader light />
            : conf && conf.enable ? "Upload" : "Finish"
          }
        </button>
      </form>
      { conf && conf.enable &&
        <button className={style.end_btn} disabled={!conf} onClick={handleShowValidate}>
          { loading.value
            ? <Loader light />
            : "Validate and finish"
          }
        </button>
      }
    </>
  )
}
