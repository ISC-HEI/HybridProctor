'use client'

import { FormEvent, useEffect, useRef, useState } from "react";
import Input from "../input";
import style from "./index.module.scss";
import Loader from "../loader";
import { useNotifications } from "@/lib/utils/hooks/useNotifications";

interface ValidateHashProps {
  show: boolean;
  onClose: () => void;
}

export default function ValidateHash({ show, onClose }: ValidateHashProps) {
  const [hash, setHash] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const addNotification = useNotifications().addNotification
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (show) {
      dialogRef.current?.showModal();
    }
    else {
      dialogRef.current?.close();
    }
  }, [show]);

  const handleValidate = async (evt: FormEvent) => {
    evt.preventDefault()

    setLoading(true);

    const state = await (await fetch("/api/hash", {
      method: "POST",
      body: JSON.stringify({ hash }),
      headers: {
        "Content-Type": "application/json"
      }
    })).json();

    setLoading(false);

    addNotification({ success: state.ok, text: state.message, infinite: false })

    setHash("");

    onClose();
  }

  const handleClose = () => {
    setHash("");
    onClose();
  }

  return (
    <dialog className={style.dialog} ref={dialogRef} onCancel={evt => evt.preventDefault()}>
      <form className={style.form} onSubmit={handleValidate}>
        <h2>Please enter the last hash you got</h2>       

        <label className={style.label}>
          Hash
          <Input type="text" name='surname' value={hash} required onChange={e => setHash(e.target.value)}/>
        </label>

        <div className={style.btns}>
          <button className={style.end} type='submit'>
            { loading
              ? <Loader />
              : "Validate"
            }
          </button>
          <button className={style.close} type='reset' onClick={handleClose}>
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  )
}
