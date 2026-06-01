
import dayjs from "dayjs";
import LockInfo from "../lockInfo";
import style from "./index.module.scss";
import { addNotification } from "@/lib/utils/signals/notificationsStore";

interface MonitorInfosProps {
  connected: number;
  total: number;
}

export default function MonitorInfos({ connected, total }: MonitorInfosProps) {
  const formatTime = (time: number) => {
    return dayjs.unix(time).format("DD-MM-YYYY, HH:mm:ss");
  }

  const handleSetTime = async () => {
    const { time } = await (await fetch("/api/auth/time", {
      method: "POST",
      body: JSON.stringify({
        timestamp: dayjs().toISOString()
      }),
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })).json();

    addNotification({ infinite: false, success: true, text: `Server time set to : ${formatTime(time)}` });
  }

  return (
    <div className={style.container}>
      <LockInfo />
      <div className={style.infos}>
        <div className={style.students}>
          <p>Connected students : <span id="connected_students" className={style.number}>{connected}</span></p>
          <p>Total students : <span id="total_students" className={style.number}>{total}</span></p>
        </div>

        <button className={style.link} onClick={handleSetTime}>Set Time</button>

        <a id="explorer_link" href="/admin/explorer" className={style.link}>File Explorer</a>
      </div>
    </div>
  )
}
