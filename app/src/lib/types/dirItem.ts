
export type ItemType = "file" | "directory";

export interface DirItem {
    id: string;
    path: string;
    name: string;
    type: ItemType;
}
