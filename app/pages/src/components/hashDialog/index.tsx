'use client'

import { useEffect, useRef } from "react";
import style from "./index.module.scss"; 

interface HashDialogProps {
  hash: string;
  show: boolean
  onClose: () => void;
}

export default function HashDialog({ hash, show, onClose }: HashDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  
  useEffect(() => {
    if (show) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [show])

  const handleClose = () => {
    onClose();

    dialogRef.current?.close();
  }

  return (
    <dialog className={style.dialog} ref={dialogRef} onCancel={evt => evt.preventDefault()}>
      <div className={style.content}>
        <h2 className={style.title}>This is the hash of your files.</h2>
        <p>You will need it at the end of the exam to validate which version of your files you want to be used.</p>
        <p>Please save it if it&apos;s your final version.</p>

        <p>Hash : <span className={style.hash}>{hash}</span></p>

        <button className={style.close} onClick={handleClose}>Close</button>
      </div>
    </dialog>
  )
}
