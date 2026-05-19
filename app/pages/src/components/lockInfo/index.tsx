'use client'

import style from "./index.module.scss";
import { useEffect, useState } from "react"

export default function LockInfo() {
  const [locked, setLocked] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setLocked((await (await fetch("/api/fetch/locked")).json()).locked);
    })()
  }, []);

  const handleLock = () => {
    setLocked(!locked);

    fetch("/api/lock", {
      method: "POST"
    });
  }

  return (
    <article className={style.lockinfo}>
      <p>The exam is currently <span className={`${locked ? style.locked : style.unlocked}`}>{ locked ? "locked" : "unlocked" }</span></p>
      <button className={style.button} onClick={handleLock}>{ locked ? "Unlock" : "Lock" }</button>
    </article>
  )
}
