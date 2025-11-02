import type { Book } from "@interfaces/book";
import { useDeleteNoteMutation, useGetNotesQuery } from "./notesApi";
import { useState } from "react";
import {  Edit, Trash } from "lucide-react";

type Props = {
  isbn: Book["isbn"];
  noteId: string;
  page: number;
  description: string;
  handleEditNote: (currentNode: string, editNote: boolean) => void;
};

export function Note({
  isbn,
  noteId,
  page,
  description,
  handleEditNote,
}: Props) {
  const [hoverOver, setHoverOver] = useState(false);
  const [onDelete] = useDeleteNoteMutation();

  const handleMouseEnter = () => {
    setHoverOver(true);
  };

  const handleMouseLeave = () => {
    setHoverOver(false);
  };

  const handleEdit = async () => {
    handleEditNote(noteId, true);
  };

  const handleDelete = async () => {
    await onDelete({ noteId, isbn });
  };

  return (
    <div
      className="flex flex-row gap-4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <p className="text-3xl font-bold min-w-15 border-r border-secondary pr-4">
        {page}
      </p>
      <div className="flex flex-row justify-around">
        <p className="w-sm">{description}</p>
        <div
          className="flex flex-col gap-2"
          style={{ visibility: hoverOver ? "visible" : "hidden" }}
        >
          <div
            className="p-2 bg-card rounded-lg hover:bg-secondary"
            onClick={handleEdit}
          >
            <Edit width={16} height={16} />
          </div>

          <div
            className="p-2 bg-red-400 rounded-lg hover:bg-red-500"
            onClick={() => handleDelete()}
          >
            <Trash width={16} height={16} />
          </div>
        </div>
      </div>
    </div>
  );
}
