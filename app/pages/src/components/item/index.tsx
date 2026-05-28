
import { type DirItem } from "@srvtypes/dirItem";
import style from "./index.module.scss";
import { FolderIcon, FileIcon } from "lucide-preact";

interface ItemProps {
  item: DirItem;
  selected: boolean;
  onClick: (item: DirItem, evt: MouseEvent) => void;
  onDoubleClick: (item: DirItem, evt: MouseEvent) => void;
}

export default function Item({ item, selected, onClick, onDoubleClick }: ItemProps) {

  const handleClick = (evt: MouseEvent) => {
    evt.stopPropagation();
    return onClick(item, evt);
  }

  const handleDoubleClick = (evt: MouseEvent) => {
    evt.stopPropagation();
    return onDoubleClick(item, evt);
  }

  return (
    <article className={`${style.item} ${ selected ? style.selected : '' }`} onClick={handleClick} onDblClick={handleDoubleClick}>
      <div className={style.iconContainer}>
        { item.type === "directory"
          ? <FolderIcon className={`${style.icon} ${style.directory} ${item.name.endsWith("_validated") ? style.validated : ''}`} />
          : <FileIcon className={style.icon} />
        }
      </div>
      <p className={style.name}>{ item.name }</p>
    </article>
  )
}
