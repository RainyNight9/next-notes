import React from "react";
import Link from "next/link";
import Image from 'next/image'
import { getAllNotes } from '@/lib/redis';
import SidebarNoteList from '@/components/SidebarNoteList';

export default async function Sidebar() {
  const notes = await getAllNotes()

  return (
    <>
      <section className="col sidebar">
        <Link href={"/"} className="link--unstyled">
          <section className="sidebar-header">
            <Image
              className="logo"
              src="/next.svg"
              width={89}
              height={18}
              alt="Picture of the author"
              role="presentation"
            />
            <strong>Next Notes</strong>
          </section>
        </Link>
        <section className="sidebar-menu" role="menubar">
          {/* SideSearchField */}
        </section>
        <nav>
          <SidebarNoteList notes={notes} />
        </nav>
      </section>
    </>
  );
}
