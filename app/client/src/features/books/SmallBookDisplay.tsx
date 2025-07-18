import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { BookRaw } from "@interfaces/book";
import { Pencil, TrashIcon } from "lucide-react";
import { useNavigate } from "react-router";
import { useDeleteBookMutation } from "./booksApi";

export function SmallBookDisplay({ book }: { book: BookRaw }) {
  const navigate = useNavigate();

  const [deleteBook] = useDeleteBookMutation();

  return (
    <ContextMenu>
      <ContextMenuTrigger className="z-[0]">
        <button
          type="button"
          className="cursor-pointer h-full overflow-hidden rounded-md"
          onClick={() => navigate(`/books/${book.isbn}`)}
        >
          <img
            src={book.imageUrl}
            className="h-full aspect-(--cover) object-center object-cover"
          />
        </button>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem
          variant="destructive"
          onClick={() => {
            deleteBook(book.isbn);
          }}
        >
          <TrashIcon />
          Delete
        </ContextMenuItem>
        <ContextMenuItem
          onClick={() => {
            alert("Not Implemented Yet");
          }}
        >
          <Pencil />
          Edit
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
