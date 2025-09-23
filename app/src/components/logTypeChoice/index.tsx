import { LogType } from "@/utils/logger";
import { ChangeEvent } from "react";

import style from './index.module.scss'

interface LogTypeChoiceProps {
  onChoice: (value: LogType) => void;
}

export default function LogTypeChoice({ onChoice }: LogTypeChoiceProps) {
  const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChoice(e.currentTarget.value as LogType);
  }

  return (
    <form className={style.form}>
      <label className={style.label}>
        All
        <input type="radio" name="type" value="all" defaultChecked onChange={handleTypeChange} />
        <span className={style.checkbox}></span>
      </label>
      <label className={style.label}>
        Infos
        <input type="radio" name="type" value="infos" onChange={handleTypeChange} />
        <span className={style.checkbox}></span>
      </label>
      <label className={style.label}>
        Warnings
        <input type="radio" name="type" value="warnings" onChange={handleTypeChange} />
        <span className={style.checkbox}></span>
      </label>
      <label className={style.label}>
        Errors
        <input type="radio" name="type" value="errors" onChange={handleTypeChange} />
        <span className={style.checkbox}></span>
      </label>
    </form>
  )
}
