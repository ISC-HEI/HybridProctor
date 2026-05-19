
import { CSSProperties } from "react";
import style from "./index.module.scss";
import Loader from "../loader";

interface RadialProgressProps {
  progress: number;
  total: number;
}

export default function RadialProgress({ progress, total }: RadialProgressProps) {
  const percentage = Math.ceil((progress / total) * 100);

  return (
    <div className={style.radialContainer}>
      {
        !isNaN(percentage)
          ?
          <div
            style={{ '--progress': `${percentage}%` } as CSSProperties}
            className={style.radial}
            role="progressbar"
            aria-valuenow={25}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <p>{ percentage }%</p>
          </div>
          :
          <Loader />
      }
    </div>
  )
}
