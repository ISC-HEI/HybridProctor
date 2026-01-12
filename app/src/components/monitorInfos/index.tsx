
import Link from "next/link";
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
          <p>Connected students : <span className={style.number}>{connected}</span></p>
          <p>Total students : <span className={style.number}>{total}</span></p>
        </div>

        <Link href="/admin/explorer" className={style.link}>File Explorer</Link>
      </div>
    </div>
  )
}
