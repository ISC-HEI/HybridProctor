'use client'

import { MouseEvent, useEffect, useState } from "react";
import style from "./page.module.scss";
import { fetchDisk, fetchItems, prepareDownload } from "./page.server";
import { DirItem } from "@/lib/types/dirItem";
import Item from "@/components/item";
import { useRouter } from "next/navigation";
import PathIndicator from "@/components/pathIndicator";
import { DownloadIcon } from "lucide-react";
import RadialProgress from "@/components/radialProgress";
import { useNotifications } from "@/lib/utils/hooks/useNotifications";
import Loader from "@/components/loader";

interface ExplorerProps {
  path: string|undefined
}

export default function Explorer({ path }: ExplorerProps) {
  const [items, setItems] = useState<DirItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<DirItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [used, setUsed] = useState<number>(0);
  const [downloading, setDownloading] = useState<boolean>(false);
  const { addNotification } = useNotifications();
  const router = useRouter();

  useEffect(() => {(
    async () => {
      setItems(await fetchItems(path));
      
      const { total, used } = await fetchDisk();

      setTotal(total);
      setUsed(used);
    }
  )()}, []);

  const handleSelect = (item: DirItem, evt: MouseEvent) => {
    if (!evt.ctrlKey) {
      setSelectedItems([item]);
    }
    else {
      setSelectedItems([...selectedItems, item]);
    }
  }

  const handleEnter = async (item: DirItem, evt: MouseEvent) => {
    if (item.type !== "directory") return; // open not implemented yet

    router.push(`/admin/explorer/${item.path}/${item.name}`);
  }

  const handleDownload = async () => {
    if (selectedItems.length === 0) {
      return;
    }

    setDownloading(true);

    try {
      const zipName = await prepareDownload(selectedItems);

      const downloadUrl = `/api/download/${zipName}`;
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "download.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      addNotification({
        infinite: false,
        success: true,
        text: "Successfully downloaded files"
      })

    } catch (error) {
      console.error("Failed to prepare download", error);

      addNotification({
        infinite: false,
        success: false,
        text: "Failed to prepare download"
      });

    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className={style.page}>
      <main className={style.explorer}>
        <div className={style.manage}>
          <PathIndicator path={path} />
        </div>
        <ol className={style.grid} onClick={() => setSelectedItems([])}>
          {
            items.length > 0
              ? items.map(item => <Item key={item.id} item={item} selected={selectedItems.includes(item)} onClick={handleSelect} onDoubleClick={handleEnter} />)
              : <Loader />
          }
        </ol>
      </main>
      <aside className={style.storage}>
        <div className={style.progress}>
          <RadialProgress progress={used} total={total} />
          <p>
            {
              downloading
                ? "Preparing download..."
                : "Disk usage"
            }
          </p>
        </div>
        <button className={style.download} disabled={selectedItems.length < 1 || downloading} onClick={handleDownload}><DownloadIcon className={style.icon} /></button>
      </aside>
    </div>
  )
}
