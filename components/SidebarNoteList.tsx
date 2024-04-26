import dayjs from 'dayjs';
import SidebarNoteItem from '@/components/SidebarNoteItem';
import type { INote, INotes } from "@/lib/redis";

export default async function NoteList({ notes }: INotes) {
  const arr = Object.entries(notes);

  if (arr.length == 0) {
    return <div className="notes-empty">{"No notes created yet!"}</div>;
  }

  return (
    <ul className="notes-list">
      {arr.map(([noteId, note]) => {
        // const { title, updateTime } = JSON.parse(note) as INote;
        // return (
        //   <li key={noteId}>
        //     <header className="sidebar-note-header">
        //       <strong>{title}</strong>
        //       <small>{dayjs(updateTime).format('YYYY-MM-DD hh:mm:ss')}</small>
        //     </header>
        //   </li>
        // );
        return (<li key={noteId}>
          <SidebarNoteItem noteId={noteId} note={JSON.parse(note)} />
        </li>);
      })}
    </ul>
  );
}
