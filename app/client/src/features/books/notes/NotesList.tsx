import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Book } from "@interfaces/book";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { useGetNotesQuery } from "./notesApi";
import { Note } from "./Note";

type Props = {
  isbn: Book["isbn"];
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleEditNote: (currNote: string, edit: boolean) => void;
};

export function NotesList({ isbn, setOpen, handleEditNote }: Props) {
  const { data: notes } = useGetNotesQuery(isbn);

  return (
    <div className="flex flex-col gap-6">
      {notes &&
        notes.notes.map((note) => {
          return note._id ? (
            <Note
              isbn={isbn}
              noteId={note._id}
              page={note.page}
              description={note.description}
              handleEditNote={handleEditNote}
            />
          ) : (
            <></>
          );
        })}
    </div>
  );
}
