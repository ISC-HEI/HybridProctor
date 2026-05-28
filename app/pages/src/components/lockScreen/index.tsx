
import style from "./index.module.scss";

interface LockScreenProps {
  finished: boolean
}

export default function LockScreen({ finished }: LockScreenProps) {
  const refresh = () => {
    window.location.reload();
  }

  return (
    <main className={style.lockscreen}>
      <h1 id="title" className={style.title}>
        { finished
          ? "You already finished the exam."
          : "The exam hasn't started yet, please wait."
        }
      </h1>

      <div className={style.container}>
        <button id="refresh_btn" className={style.refresh} onClick={refresh}>Refresh</button>
      </div> 
    </main>
  )
}
