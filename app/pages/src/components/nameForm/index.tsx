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

  const handleSubmit = async (evt: SubmitEvent) => {
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
    <dialog id="name_form" className={style.dialog} ref={dialogRef} onCancel={evt => evt.preventDefault()}>
      <h2>Please enter your full name</h2>
      <form className={style.form} id='form' onSubmit={handleSubmit}>
        <div className={`input-group ${style.inputs}`}>
          <label className={style.label}>
            Surname
            <Input id="surname" type="text" name='surname' value={surname} required onInput={evt => surname.value = evt.currentTarget.value} />
          </label>
          <label className={style.label}>
            Name
            <Input id="lastname" type="text" name='name' value={name} required onInput={evt => name.value = evt.currentTarget.value} />
          </label>
        </div>
        <p id="message" className={ok ? style.success : style.error}>{message}</p>
        <button id="submit" className={style.btn} type='submit'>
          { loading.value
            ? <Loader />
            : "Start"
          }
        </button>
      </form> 
    </dialog>
  )
}
