'use client'

import { FormEvent, useEffect, useRef, useState } from "react";

import style from './index.module.scss';
import Input from "../input";
import Loader from "../loader";


export default function NameForm() {
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [ok, setOk] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {(
    async () => {
      const fulln = localStorage.getItem("name");
      
      const data = await (await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify({ name: fulln }),
        headers: {
          "Content-Type": "application/json"
        }
      })).json();

      if (!fulln || !data.status) {
        dialogRef.current?.showModal();
      }
    }
  )()}, []);

  const handleSubmit = async (evt: FormEvent) => {
    evt.preventDefault();

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "PATCH",
      body: JSON.stringify({
        name,
        surname
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await res.json();

    setOk(data.ok);
    setMessage(data.message);

    setLoading(false);

    if (data.ok) {
      localStorage.setItem("name", data.fullname);
      dialogRef.current?.close();
    }
  }

  return (
    <dialog className={style.dialog} ref={dialogRef} onCancel={evt => evt.preventDefault()}>
      <h2>Please enter your full name</h2>
      <form className={style.form} id='form' onSubmit={handleSubmit}>
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
        <p className={`status-${ok ? "success" : "error"}`}>{message}</p>
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
