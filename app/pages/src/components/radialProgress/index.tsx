
import style from "./index.module.scss";
import Loader from "../loader";
import type { Signal } from "@preact/signals";

interface RadialProgressProps {
  progress: Signal<number>;
  total: Signal<number>;
}

export default function RadialProgress({ progress, total }: RadialProgressProps) {
  const percentage = Math.ceil((progress.value / total.value) * 100);

  return (
    <div className={style.radialContainer}>
      {
        !isNaN(percentage)
          ?
          <div
            style={{ '--progress': `${percentage}%` }}
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
