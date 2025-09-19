'use client'

import { RefObject, useEffect, useState } from "react";
import { registerStudent } from "./index.server";
import { useActionState } from "react";

interface NameFormProps {
  ref: RefObject<HTMLDialogElement|null>;
}

export default function NameForm({ ref }: NameFormProps) {
  const [name, setName] = useState<string>("");
  const [state, formAction] = useActionState(registerStudent, { ok: false, message: "", name: "" });

  useEffect(() => {
    console.log("test")
    if (state.ok && state.name !== "") {
      localStorage.setItem("name", state.name);
      ref.current!.close();
    }
  }, [state, ref]);

  return (
    <dialog ref={ref}>
      <form id='form' action={formAction}>
        <p>Please enter your name</p>
        <div className="input-group">
          <label htmlFor='name'>Your name: </label>
          <input type="text" name='name' id='name' placeholder="Enter your full name" value={name} onChange={e => setName(e.target.value)}/>
        </div>
        <p className={`status-${state.ok ? "success" : "error"}`}>{state.message}</p>
        <button className="submit-btn btn-primary" type='submit'>Start</button>
      </form> 
    </dialog>
  )
}
