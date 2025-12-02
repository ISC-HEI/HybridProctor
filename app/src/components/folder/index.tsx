
import { MouseEvent } from "react";
import style from "./index.module.scss";
import { Directory } from "@/lib/types/directory";

interface FolderProps {
  directory: Directory
  selected: boolean;
  onClick: (evt?: MouseEvent) => void;
}

export default function Folder({ directory, selected, onClick }: FolderProps) {
  return (
    <article className={`${style.folder} ${selected ? style.selected : ''}`} onClick={onClick}>
      
    </article>
  )
}
