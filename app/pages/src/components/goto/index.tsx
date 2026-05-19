import { ElementType } from "react";
import style from "./index.module.scss";

interface GotoProps {
  href: string;
  Icon: ElementType;
}


export default function Goto({ href, Icon }: GotoProps) {
  return (
    <a href={href} className={style.goto}>
      <div className={style.container}>
        <Icon className={style.icon} />
      </div>
    </a>
  )
}
