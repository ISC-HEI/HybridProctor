
import { Notification } from "@/lib/types/notification";
import style from "./index.module.scss";
import { CheckIcon, XIcon } from "lucide-react";
import { motion } from "motion/react";

interface ToastProps {
  notification: Notification
}

export default function Toast({ notification }: ToastProps) {

  return (
    <motion.li
      layout initial={{ opacity: 0, right: "-80%" }} animate={{ opacity: 1, right: 0 }} exit={{ opacity: 0, right: "-80%" }}
      className={`${style.toast} ${notification.infinite ? style.infinite : ''} ${notification.success ? style.success : style.error}`}
    >
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
    </motion.li>
  )
}
