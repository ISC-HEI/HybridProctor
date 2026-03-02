'use client'

import style from "./index.module.scss";
import { useEffect, useState } from "react"
import { fetchLocked } from "./index.server";
import { lock } from "./index.server";

export default function LockInfo() {
  const [locked, setLocked] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      setLocked(await fetchLocked());
    })()
  }, []);

  const handleLock = () => {
    setLocked(!locked);

    lock()
  }

  return (
    <article className={style.lockinfo}>
      <p>The exam is currently <span className={`${locked ? style.locked : style.unlocked}`}>{ locked ? "locked" : "unlocked" }</span></p>
      <button className={style.button} onClick={handleLock}>{ locked ? "Unlock" : "Lock" }</button>
    </article>
  )
}
