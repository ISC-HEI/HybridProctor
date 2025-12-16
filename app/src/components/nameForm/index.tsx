'use client'

import { useEffect, useRef, useState } from "react";
import { isRegistered, registerStudent } from "./index.server";
import { useActionState } from "react";

import style from './index.module.scss';
import Input from "../input";
import Loader from "../loader";


export default function NameForm() {
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [state, formAction] = useActionState(registerStudent, { ok: false, message: "", fullname: "" });

  useEffect(() => {
    if (state.ok && state.fullname !== "") {
      localStorage.setItem("name", state.fullname);
      dialogRef.current?.close();
      setLoading(false);
    }
  }, [state]);

  useEffect(() => {(
    async () => {
      const fulln = localStorage.getItem("name");

      if (!fulln || !await isRegistered(fulln)) {
        dialogRef.current?.showModal();
      }
    }
  )()}, []);

  return (
    <dialog className={style.dialog} ref={dialogRef} onCancel={evt => evt.preventDefault()}>
      <h2>Please enter your full name</h2>
      <form className={style.form} id='form' action={formAction} onSubmit={() => setLoading(true)}>
        <div className={`input-group ${style.inputs}`}>
          <label className={style.label}>
            Surname
            <Input type="text" name='surname' value={surname} required onChange={e => setSurname(e.target.value)}/>
          </label>
          <label className={style.label}>
            Name
            <Input type="text" name='name' value={name} required onChange={e => setName(e.target.value)}/>
          </label>
        </div>
        <p className={`status-${state.ok ? "success" : "error"}`}>{state.message}</p>
        <button className={`${style.btn} submit-btn btn-primary`} type='submit'>
          { loading
            ? <Loader />
            : "Start"
          }
        </button>
      </form> 
    </dialog>
  )
}
