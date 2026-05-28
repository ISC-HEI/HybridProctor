import style from "./index.module.scss";
import Toast from "../toast";
import { notifications } from "@/lib/utils/signals/notificationsStore";

export default function ToastList() {
  return (
    <ol id="toast_list" className={style.toastList}>
    {
      notifications.value && notifications.value.map(notification => 
        <Toast key={notification.id} notification={notification} />
      )
    }
    </ol>
  )
}
