
import style from "./index.module.scss";

interface LoaderProps {
  light?: boolean;
}

export default function Loader({ light }: LoaderProps) {
  return (
    <div className={style.loaderWrapper}>
      <span className={`${style.loader} ${light ? style.light : ""}`}></span>
    </div>
  )
}
