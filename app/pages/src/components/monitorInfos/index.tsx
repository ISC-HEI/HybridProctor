
import LockInfo from "../lockInfo";
import style from "./index.module.scss";

interface MonitorInfosProps {
  connected: number;
  total: number;
}

export default function MonitorInfos({ connected, total }: MonitorInfosProps) {

  return (
    <div className={style.container}>
      <LockInfo />
      <div className={style.infos}>
        <div className={style.students}>
          <p>Connected students : <span id="connected_students" className={style.number}>{connected}</span></p>
          <p>Total students : <span id="total_students" className={style.number}>{total}</span></p>
        </div>

        <a id="explorer_link" href="/admin/explorer" className={style.link}>File Explorer</a>
      </div>
    </div>
  )
}
