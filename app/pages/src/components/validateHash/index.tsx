import { useRef } from "preact/hooks";
import Input from "../input";
import style from "./index.module.scss";
import Loader from "../loader";
import { Signal, useSignal, useSignalEffect } from "@preact/signals";
import { addNotification } from "@/lib/utils/notificationsStore";

interface ValidateHashProps {
  show: Signal<boolean>;
  onClose: () => void;
}

export default function ValidateHash({ show, onClose }: ValidateHashProps) {
  const hash = useSignal("");
  const loading = useSignal(false);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useSignalEffect(() => {
    if (show.value) {
      dialogRef.current?.showModal();
    }
    else {
      dialogRef.current?.close();
    }
  });

  const handleValidate = async (evt: Event) => {
    evt.preventDefault()

    loading.value = true;

    const state = await (await fetch("/api/hash", {
      method: "POST",
      body: JSON.stringify({ hash: hash.value }),
      headers: {
        "Content-Type": "application/json"
      }
    })).json();

    loading.value = false;

    addNotification({ success: state.ok, text: state.message, infinite: false })

    hash.value = ""

    onClose();
  }

  const handleClose = () => {
    formRef.current?.reset()
    onClose();
  }

  return (
    <dialog className={style.dialog} ref={dialogRef} onCancel={evt => evt.preventDefault()}>
      <form className={style.form} ref={formRef} onSubmit={handleValidate}>
        <h2>Please enter the last hash you got</h2>       

        <label className={style.label}>
          Hash
          <Input type="text" name='surname' value={hash} required/>
        </label>

        <div className={style.btns}>
          <button className={style.end} type='submit'>
            { loading.value
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
