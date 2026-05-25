'use client'

import FormButtons from "@/components/formButtons";
import style from "./index.module.scss";
import { XIcon } from "lucide-preact";
import Input from "@/components/input";
import { useSignal } from "@preact/signals";
import { nextStep } from "@/lib/utils/signals/configure";
import type { TargetedMouseEvent, TargetedEvent } from "preact";

const DEFAULT_LABEL = "Please upload the following files at the end: ";

export default function ConfigForm() {
  const enable = useSignal<boolean>(true);
  const label = useSignal<string>("");
  const files = useSignal<string[]>([]);
  const fileToAdd = useSignal<string>("");
  const isPending = useSignal<boolean>(false);

  const handleSubmit = async (evt: TargetedEvent<HTMLFormElement>) => {
    evt.preventDefault();

    isPending.value = true;
    
    try {
      await fetch("/api/upload/config", {
        method: "POST",
        body: JSON.stringify({
          config: {
            enable,
            label: label.value !== "" ? label : DEFAULT_LABEL,
            studentsFiles: files
          }
        }),
        headers: {
          "Content-Type": "application/json",
        }
      }) 

      nextStep();
    }
    catch (err) {
      alert("Upload failed, please retry");
    }
    finally {
      isPending.value = false
    }
  }

  const handleDeleteFile = (file: string) => {
    files.value = files.value.filter(v => v !== file);
  }

  const handleAddFile = (evt: TargetedMouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    if (fileToAdd.value !== '' && !files.value.includes(fileToAdd.value)) {
      files.value = [...files.value, fileToAdd.value];

      fileToAdd.value = '';
    }
  }

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      <fieldset className={style.field}>
        <h2 className={style.title}>Configuration</h2>

        <label className={style.label}>
          Students need to upload files
          <input type="checkbox" checked={enable} onInput={evt => enable.value = evt.currentTarget.checked} name="enabled" />
        </label>
        { enable.value &&
          <>
            <label className={`${style.label} ${style.desc}`}>
              Label
              <Input name="label" placeholder={DEFAULT_LABEL} area value={label} onInput={evt => label.value = evt.currentTarget.value}/>
            </label>

            <div className={style.filesContainer}>
              <label className={style.label}>
                <span>
                  Add file <span className="required">*</span>
                </span>
                <Input value={fileToAdd} onInput={evt => fileToAdd.value = evt.currentTarget.value} />
                <button onClick={handleAddFile} className={style.addButton}>Add</button>
              </label> 

              <ol className={style.files}>
                {
                  files.value.length !== 0
                    ?
                    files.value.map(
                      (file, idx) =>
                        <li className={style.file} key={idx}>
                          <p><strong>{file}</strong></p>
                          <button className={style.delete} onClick={evt => { evt.preventDefault(); handleDeleteFile(file) }}>
                            <XIcon size={16}/>
                          </button>
                        </li>
                    )
                    :
                    <li className={style.noFiles}>
                      <p><strong>No files</strong></p>
                    </li>
                }
              </ol>
            </div>

          </>
        }
      </fieldset> 

      <FormButtons disabled={enable.value && files.value.length === 0} loading={isPending}/>
    </form>
  )
}
