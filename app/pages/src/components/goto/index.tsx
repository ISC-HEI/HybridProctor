import type { JSX } from "preact";
import style from "./index.module.scss";

interface GotoProps {
  href: string;
  Icon: JSX.ElementType;
}


export default function Goto({ href, Icon }: GotoProps) {
  return (
    <a id="goto" href={href} className={style.goto}>
      <div className={style.container}>
        <Icon className={style.icon} />
      </div>
    </a>
  )
}
