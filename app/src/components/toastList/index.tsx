'use client'

import { AnimatePresence } from "motion/react";
import style from "./index.module.scss";
import Toast from "../toast";
import { useNotifications } from "@/lib/utils/hooks/useNotifications";

export default function ToastList() {
  const notifications = useNotifications().notifications;

  return (
    <ol className={style.toastList}>
      <AnimatePresence initial={false} mode="popLayout">
        {
          notifications && notifications.map(notification => 
            <Toast key={notification.id} notification={notification} />
          )
        }
      </AnimatePresence>
    </ol>
  )
}
