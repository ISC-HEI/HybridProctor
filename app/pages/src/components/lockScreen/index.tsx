
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
      <h1 className={style.title}>
        { finished
          ? "You already finished the exam."
          : "The exam hasn't started yet, please wait."
        }
      </h1>

      <div className={style.container}>
        <button className={style.refresh} onClick={refresh}>Refresh</button>
      </div> 
    </main>
  )
}
