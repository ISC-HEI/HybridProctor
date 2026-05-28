
import { ChevronRightIcon } from "lucide-preact";
import style from "./index.module.scss";

interface PathIndicatorProps {
  path: string|undefined
}


export default function PathIndicator({ path }: PathIndicatorProps) {
  const pathList = path !== undefined ? path.split('/') : [];

  if (pathList[0] === '') {
    pathList.shift();
  }

  return (
    <ol id="path" className={style.path}>
      <li className={style.dir}>
        <a href="/admin/explorer">
          <p>root</p>
        </a>
        { path !== undefined
          && <ChevronRightIcon className={style.chevron} />
        }
      </li>

      {
        pathList.map((dir, idx) =>
          <li className={style.dir} key={idx}>
            <a href={`/admin/explorer/${pathList.filter((_, i) => i <= idx).join("/")}`}>
              <p>{dir}</p>
            </a>
            { idx !== pathList.length - 1
              && <ChevronRightIcon className={style.chevron} />
            }
          </li>
        )
      }
    </ol>
  )
}
