"use client";

import { useEffect, useState } from "react";
import NotePreview from "@/components/NotePreview";
import { useFormState } from "react-dom";
import { deleteNote, saveNote } from '../app/actions'
import SaveButton from '@/components/SaveButton'
import DeleteButton from '@/components/DeleteButton'
import { TEditorFormState } from "@/types"

interface IProps {
  noteId: string | null;
  initialTitle: string;
  initialBody: string;
}

const initialState: TEditorFormState  = {
  message: null,
  errors: []
}

export default function NoteEditor({ noteId, initialTitle, initialBody }: IProps) {
  const [saveState, saveFormAction] = useFormState<TEditorFormState, FormData>(saveNote, initialState)
  const [delState, delFormAction] = useFormState<TEditorFormState, FormData>(deleteNote, initialState)

  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const isDraft = !noteId;

  useEffect(() => {
    if (saveState?.errors) {
      // 处理错误
      console.log(saveState.errors);
    }
  }, [saveState]);

  return (
    <div className="note-editor">
      <form className="note-editor-form" autoComplete="off">
        <div className="note-editor-menu" role="menubar">
          <input type="hidden" name="noteId" value={noteId  || ''} />
          <SaveButton formAction={saveFormAction} />
          <DeleteButton isDraft={isDraft} formAction={delFormAction} />
        </div>
        <div className="note-editor-menu">
          { saveState?.message }
          { saveState?.errors && saveState?.errors[0]?.message}
        </div>
        <label className="offscreen" htmlFor="note-title-input">
          Enter a title for your note
        </label>
        <input
          id="note-title-input"
          type="text"
          name="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
        />
        <label className="offscreen" htmlFor="note-body-input">
          Enter the body for your note
        </label>
        <textarea
          name="body"
          value={body}
          id="note-body-input"
          onChange={(e) => setBody(e.target.value)}
        />
      </form>
      <div className="note-editor-preview">
        <div className="label label--preview" role="status">
          Preview
        </div>
        <h1 className="note-title">{title}</h1>
        <NotePreview>{body}</NotePreview>
      </div>
    </div>
  );
}
