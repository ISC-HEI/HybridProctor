'use client'

import { useEffect, useRef, useState } from "react";
import { registerStudent } from "./index.server";
import { useActionState } from "react";

import style from './index.module.scss';
import { nameInDb } from "@services/db/helpers";


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

      if (!name || !await nameInDb(name)) {
        dialogRef.current?.showModal();
      }
    }
  )()}, []);

  return (
    <dialog className={style.dialog} ref={dialogRef} onCancel={evt => evt.preventDefault()}>
      <form className={style.form} id='form' action={formAction}>
        <p>Please enter your name</p>
        <div className="input-group">
          <label htmlFor='name'>Your name: </label>
          <input type="text" name='name' id='name' placeholder="Enter your full name" value={name} required onChange={e => setName(e.target.value)}/>
        </div>
        <p className={`status-${state.ok ? "success" : "error"}`}>{state.message}</p>
        <button className="submit-btn btn-primary" type='submit'>Start</button>
      </form> 
    </dialog>
  )
}
