import { useSignal } from "@preact/signals";
import style from "./index.module.scss";
import { useEffect } from "preact/hooks"

export default function LockInfo() {
  const locked = useSignal<boolean>(true);

  useEffect(() => {
    (async () => {
       locked.value = (await (await fetch("/api/fetch/locked")).json()).locked;
    })()
  }, []);

  const handleLock = () => {
    locked.value = !locked.value;
    console.log("rah")

    fetch("/api/lock", {
      method: "POST"
    });
  }

  return (
    <article className={style.lockinfo}>
      <p>The exam is currently <span className={`${locked.value ? style.locked : style.unlocked}`}>{ locked.value ? "locked" : "unlocked" }</span></p>
      <button className={style.button} onClick={handleLock}>{ locked ? "Unlock" : "Lock" }</button>
    </article>
  )
}
