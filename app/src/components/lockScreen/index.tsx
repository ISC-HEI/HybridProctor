'use client'

import style from "./index.module.scss";

export default function LockScreen() {
  const refresh = () => {
    window.location.reload();
  }

  return (
    <main className={style.lockscreen}>
      <h1 className={style.title}>The exam hasn't started yet, please wait.</h1>

      <div className={style.container}>
        <button className={style.refresh} onClick={refresh}>Refresh</button>
      </div> 
    </main>
  )
}
