import { useEffect, useRef } from "react";

import style from './index.module.scss';
import Input from "../input";
import Loader from "../loader";
import { useSignal } from "@preact/signals";


export default function NameForm() {
  const name = useSignal<string>("");
  const surname = useSignal<string>("");
  const loading = useSignal<boolean>(false);
  const ok = useSignal<boolean>(false);
  const message = useSignal<string>("");

  const dialogRef = useRef<HTMLDialogElement>(null);

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

  const handleSubmit = async (evt: Event) => {
    evt.preventDefault();

    loading.value = true;

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

    ok.value = data.ok;
    message.value = data.message;

    loading.value = true

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
            <Input type="text" name='surname' value={surname} required/>
          </label>
          <label className={style.label}>
            Name
            <Input type="text" name='name' value={name} required/>
          </label>
        </div>
        <p className={`status-${ok ? "success" : "error"}`}>{message}</p>
        <button className={`${style.btn} submit-btn btn-primary`} type='submit'>
          { loading.value
            ? <Loader />
            : "Start"
          }
        </button>
      </form> 
    </dialog>
  )
}
