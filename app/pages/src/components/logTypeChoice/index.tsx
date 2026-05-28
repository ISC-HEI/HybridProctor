import { type LogType } from "@srvtypes/logger";

import style from './index.module.scss'
import type { TargetedInputEvent } from "preact";

interface LogTypeChoiceProps {
  onChoice: (value: LogType) => void;
}

export default function LogTypeChoice({ onChoice }: LogTypeChoiceProps) {
  const handleTypeChange = (e: TargetedInputEvent<HTMLInputElement>) => {
    onChoice(e.currentTarget.value as LogType);
  }

  return (
    <form className={style.form}>
      <label className={style.label}>
        All
        <input id="all_radio" type="radio" name="type" value="all" defaultChecked onChange={handleTypeChange} />
        <span className={style.checkbox}></span>
      </label>
      <label className={style.label}>
        Infos
        <input id="infos_radio" type="radio" name="type" value="infos" onChange={handleTypeChange} />
        <span className={style.checkbox}></span>
      </label>
      <label className={style.label}>
        Warnings
        <input id="warnings_radio" type="radio" name="type" value="warnings" onChange={handleTypeChange} />
        <span className={style.checkbox}></span>
      </label>
      <label className={style.label}>
        Errors
        <input id="errors_radio" type="radio" name="type" value="errors" onChange={handleTypeChange} />
        <span className={style.checkbox}></span>
      </label>
    </form>
  )
}
