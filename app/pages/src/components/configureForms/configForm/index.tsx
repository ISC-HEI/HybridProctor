'use client'

import FormButtons from "@/components/formButtons";
import style from "./index.module.scss";
import { FormEvent, MouseEvent, useContext, useState, useTransition } from "react";
import { XIcon } from "lucide-react";
import Input from "@/components/input";
import { StepContext } from "@/lib/utils/hooks/stepContext";

const DEFAULT_LABEL = "Please upload the following files at the end: ";

export default function ConfigForm() {
  const [enable, setEnable] = useState<boolean>(true);
  const [label, setLabel] = useState<string>("");
  const [files, setFiles] = useState<string[]>([]);
  const [fileToAdd, setFileToAdd] = useState<string>("");

  const [isPending, startTransition] = useTransition();
  const stepContext = useContext(StepContext);



  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    
    startTransition(async () => {
      try {
        await fetch("/api/upload/config", {
          method: "POST",
          body: JSON.stringify({
            config: {
              enable,
              label: label !== "" ? label : DEFAULT_LABEL,
              studentsFiles: files
            }
          }),
          headers: {
            "Content-Type": "application/json",
          }
        }) 
        stepContext?.setStep(stepContext.step + 1);
      }
      catch (err) {
        alert("Upload failed, please retry");
      }
    });
  }

  const handleDeleteFile = (file: string) => {
    setFiles(files.filter(v => v !== file));
  }

  const handleAddFile = (evt: MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();

    if (fileToAdd !== '' && !files.includes(fileToAdd)) {
      setFiles([...files, fileToAdd]);

      setFileToAdd('');
    }
  }

  return (
    <form onSubmit={handleSubmit} className={style.form}>
      <fieldset className={style.field}>
        <h2 className={style.title}>Configuration</h2>

        <label className={style.label}>
          Students need to upload files
          <input type="checkbox" checked={enable} onChange={evt => setEnable(evt.currentTarget.checked)} name="enabled" />
        </label>
        { enable &&
          <>
            <label className={`${style.label} ${style.desc}`}>
              Label
              <Input name="label" placeholder={DEFAULT_LABEL} area value={label} onChange={evt => setLabel(evt.currentTarget.value)}/>
            </label>

            <div className={style.filesContainer}>
              <label className={style.label}>
                <span>
                  Add file <span className="required">*</span>
                </span>
                <Input value={fileToAdd} onChange={evt => setFileToAdd(evt.currentTarget.value)} />
                <button onClick={handleAddFile} className={style.addButton}>Add</button>
              </label> 

              <ol className={style.files}>
                {
                  files.length !== 0
                    ?
                    files.map(
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

      <FormButtons disabled={enable && files.length === 0} loading={isPending}/>
    </form>
  )
}
