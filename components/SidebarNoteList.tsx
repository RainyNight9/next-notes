import SidebarNoteItem from "@/components/SidebarNoteItem";
import { getAllNotes } from "@/lib/redis";
import type { INotes } from "@/lib/redis";

export default async function NoteList() {
  // 延迟
  const sleep = (ms: number): Promise<void> =>
    new Promise((r) => setTimeout(r, ms));
  await sleep(1000);

  const notes: INotes = await getAllNotes();

  const arr = Object.entries(notes);

  if (arr.length == 0) {
    return <div className="notes-empty">{"No notes created yet!"}</div>;
  }

  return (
    <ul className="notes-list">
      {arr.map(([noteId, note]) => {
        return (
          <li key={noteId}>
            <SidebarNoteItem noteId={noteId} note={JSON.parse(note)} />
          </li>
        );
      })}
    </ul>
  );
}
