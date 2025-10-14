'use client'

import { useEffect, useRef, useState } from "react";
import { isRegistered, registerStudent } from "./index.server";
import { useActionState } from "react";

import style from './index.module.scss';
import Input from "../input";


export default function NameForm() {
  const [name, setName] = useState<string>("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, formAction] = useActionState(registerStudent, { ok: false, message: "", name: "" });

  useEffect(() => {
    if (state.ok && state.name !== "") {
      localStorage.setItem("name", state.name);
      dialogRef.current?.close();
    }
  }, [state]);

  useEffect(() => {(
    async () => {
      const name = localStorage.getItem("name");

      if (!name || !await isRegistered(name)) {
        dialogRef.current?.showModal();
      }
    }
  )()}, []);

  return (
    <dialog className={style.dialog} ref={dialogRef} onCancel={evt => evt.preventDefault()}>
      <h2>Please enter your full name</h2>
      <form className={style.form} id='form' action={formAction}>
        <div className="input-group">
          <label className={style.label}>
            Name
            <Input type="text" name='name' value={name} required onChange={e => setName(e.target.value)}/>
          </label>
        </div>
        <p className={`status-${state.ok ? "success" : "error"}`}>{state.message}</p>
        <button className={`${style.btn} submit-btn btn-primary`} type='submit'>Start</button>
      </form> 
    </dialog>
  )
}
