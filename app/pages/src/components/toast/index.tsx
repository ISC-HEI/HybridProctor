
import type { Notification } from "@/lib/types/notification";
import style from "./index.module.scss";
import { CheckIcon, XIcon } from "lucide-preact";

interface ToastProps {
  notification: Notification
}

export default function Toast({ notification }: ToastProps) {
  return (
    <li className={`${style.toast} ${notification.infinite ? style.infinite : ''} ${notification.success ? style.success : style.error}`}>
      <div className={style.left}>
        <span className={`${style.externalIconWrapper} ${notification.success ? style.success : style.error}`}>
          <span className={`${style.internalIconWrapper} ${notification.success ? style.success : style.error}`}>
            {
              notification.success
                ?
                <CheckIcon className={`${style.icon} ${notification.success ? style.success : style.error}`}/>
                :
                <XIcon className={`${style.icon} ${notification.success ? style.success : style.error}`} />
            }
          </span>
        </span>
        <p className={style.message}>{notification.text}</p>
      </div>
    </li>
  )
}
