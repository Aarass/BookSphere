import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Book } from "@interfaces/book";
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import {
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useGetSpecificNoteQuery,
} from "./notesApi";

import type { BookNoteDto, NoteDto } from "@interfaces/dtos/bookNotesDto";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent } from "@radix-ui/react-collapsible";

type Props = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isbn: Book["isbn"];
  noteId?: BookNoteDto["_id"];
};

export function CreateNote({ isbn, noteId, open, setOpen }: Props) {
  const [page, setPage] = useState(0);
  const [note, setNote] = useState<NoteDto | undefined>();
  const [description, setDescription] = useState("");

  const [createNote, { isLoading: creating }] = useCreateNoteMutation();
  const [updateNote, { isLoading: updating }] = useUpdateNoteMutation();

  const { data: retNote, isLoading } = useGetSpecificNoteQuery(
    { isbn, noteId: noteId || "" },
    {
      skip: !noteId,
    }
  );

  useEffect(() => {
    setPage("");
    setDescription("");
    setNote(undefined);
  }, [open]);

  useEffect(() => {
    if (!retNote) return;

    setNote(retNote);
    setPage(retNote.page);
    setDescription(retNote.description);
  }, [retNote]);

  const handlePageChange = (event: ChangeEvent<HTMLInputElement>) => {
    let val = event.target.value;
    let pageNumber = val === "" ? 0 : Number(val);
    setPage(pageNumber);
  };

  const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const val = event.target.value;
    setDescription(val);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (description === "") return;
    if (page == "") return;

    let result;

    if (note && note._id) {
      result = await updateNote({
        isbn,
        noteId: note._id,
        description,
        page: page || 0,
      });
    } else {
      result = await createNote({ isbn, description, page: page || 0 });
    }

    if ("error" in result) return;
    handleCancel();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Collapsible open={open}>
      <CollapsibleContent>
        <form
          className="flex flex-col gap-4 p-4 border border-border rounded-xl"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="page">Page</label>
            <Input
              name="page"
              type="number"
              placeholder="Page"
              min={0}
              value={page}
              onChange={handlePageChange}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="description">Note</label>
            <Textarea
              name="description"
              placeholder="Leave your note."
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>

          <div className="flex flex-row gap-2 justify-center">
            <Button variant="secondary" type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="default" type="submit">
              {note && note._id ? "Update note" : "Add Note"}
            </Button>
          </div>
        </form>
      </CollapsibleContent>
    </Collapsible>
  );
}
