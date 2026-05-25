
'use client'

import { useEffect } from "preact/hooks";
import style from "./index.module.scss";
import { type DirItem } from "@srvtypes/dirItem";
import Item from "@/components/item";
import PathIndicator from "@/components/pathIndicator";
import { DownloadIcon, SquareActivityIcon } from "lucide-preact";
import RadialProgress from "@/components/radialProgress";
import Loader from "@/components/loader";
import Goto from "@/components/goto";
import { addNotification } from "@/lib/utils/signals/notificationsStore";
import { useSignal } from "@preact/signals";

interface ExplorerProps {
  directory: string
}

export default function Explorer({ directory }: ExplorerProps) {
  const items = useSignal<DirItem[]>([]);
  const selectedItems = useSignal<DirItem[]>([]);
  const total = useSignal<number>(0);
  const used = useSignal<number>(0);
  const downloading = useSignal<boolean>(false);

  const path = directory !== undefined ? directory : "";

  useEffect(() => {(
    async () => {
      const data = await (await fetch("/api/fetch/items", {
        method: "POST",
        body: JSON.stringify({
          path
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })).json();

      if (!data) {
        addNotification({
          infinite: false,
          success: false,
          text: "Can't read directory"
        });
      }
      else {
        items.value = data;
      }

      const diskData = await (await fetch("/api/fetch/disk")).json();

      total.value = diskData.total;
      used.value = diskData.used;
    }
  )()}, [path, addNotification]);

  const handleSelect = (item: DirItem, evt: MouseEvent) => {
    if (!evt.ctrlKey && !evt.shiftKey) {
      selectedItems.value = [item];
      return
    }

    if (evt.ctrlKey) {
      if (selectedItems.value.includes(item)) {
        selectedItems.value = selectedItems.value.filter(itm => itm !== item);
        return;
      }

      selectedItems.value = [...selectedItems.value, item];
      return;
    }

    const itemsSelection: DirItem[] = []
    const length = selectedItems.value.length;

    const lastSelectedIdx = length !== 0 ? items.value.indexOf(selectedItems.value[length - 1]) : 0;
    const itmIdx = items.value.indexOf(item);

    for (let i = Math.min(lastSelectedIdx, itmIdx); i <= Math.max(lastSelectedIdx, itmIdx); i++) {
      itemsSelection.push(items.value[i])
    }

    selectedItems.value = [...selectedItems.value, ...itemsSelection];
  }

  const handleEnter = async (item: DirItem) => {
    if (item.type !== "directory") return; // open not implemented yet

    const newPath = [path.replace(/\/$/, ''), item.name].join('/');
    navigation.navigate(`/admin/explorer/${newPath}`)
  }

  const handleDownload = async () => {
    if (selectedItems.value.length === 0) {
      return;
    }

    downloading.value = true;

    try {
      const zipName = await (await fetch("/api/prepare", {
        method: "POST",
        body: JSON.stringify({
          items: selectedItems.value
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })).text();

      const a = Object.assign(document.createElement("a"), {
        href: `/api/download/${encodeURIComponent(zipName)}`,
        download: "download.zip",
      });
      a.click();

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
      downloading.value = false;
    }
  }

  return (
    <div className={style.page}>
      <Goto href="/admin/monitor" Icon={SquareActivityIcon} />

      <main className={style.explorer}>
        <div className={style.manage}>
          <PathIndicator path={decodeURIComponent(path)} />
        </div>

        {items.value.length > 0 ? (
          <ol className={style.grid} onClick={() => selectedItems.value = []}>
            {items.value.map(item => <Item key={item.id} item={item} selected={selectedItems.value.includes(item)} onClick={handleSelect} onDoubleClick={handleEnter}></Item>)}
          </ol>
        ) : (
        <Loader />
      )}
      </main>

      <aside className={style.storage}>
        <div className={style.progress}>
          <RadialProgress progress={used} total={total} />
          <p>
          {
            downloading.value
              ? "Preparing download..."
              : "Disk usage"
          }
          </p>
        </div>
        <button className={style.download} disabled={selectedItems.value.length < 1 || downloading} onClick={handleDownload}><DownloadIcon className={style.icon} /></button>
      </aside>
    </div>
  )
}
