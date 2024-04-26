import dayjs from "dayjs";
import type { INote } from "@/lib/redis";

export default function SidebarNoteItemHeader({ title, updateTime }: INote) {
  return (
    <header className="sidebar-note-header">
      <strong>{title}</strong>
      <small>{dayjs(updateTime).format("YYYY-MM-DD hh:mm:ss")}</small>
    </header>
  );
}
