import type { Book } from "@interfaces/book";
import { BookStats } from "./BookStats";
import { RateBook } from "./rating/RateBook";
import { MyReadingStatus } from "./MyReadingStatus";
import { CommentsList } from "./comments/CommentsList";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { BookHeart, FileText, MessageCirclePlus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddBookToPicks } from "./picks/AddBookToPicks";
import { GenresDisplay } from "./GenresDisplay";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { useDeleteBookMutation } from "./booksApi";
import { CreateNote } from "./notes/CreateNote";
import { NotesList } from "./notes/NotesList";

export function BookDisplay({ book }: { book: Book }) {
  const [currentNote, setCurrentNote] = useState<string | undefined>(undefined);
  const [pressed, setPressed] = useState(false);
  const [openNote, setOpenNote] = useState(false);
  const navigate = useNavigate();

  const [deleteBookAction] = useDeleteBookMutation();

  const deleteClickHandler = async () => {
    const res = await deleteBookAction(book.isbn);

    if ("error" in res) {
      return;
    }

    navigate("/books");
  };

  const handleOpenNote = (currNote?: string | undefined, edit?: boolean) => {
    setCurrentNote(currNote);
    setOpenNote(edit ?? !openNote);
  };

  return (
    <div className="flex flex-row justify-center gap-12">
      <div className="grid grid-cols-[fit-content_fit-content] grid-rows-[auto_min-content_1fr] gap-4 w-fit h-full">
        <img
          src={book.imageUrl}
          className="w-3xs aspect-(--cover) object-center object-cover rounded-md"
        />
        <div className="max-w-md flex flex-col row-span-2">
          <h1 className="text-2xl font-bold">{book.title}</h1>

          <h2 className="opacity-70">{book.author.fullName}</h2>

          <div className="flex flex-wrap mt-4 gap-1">
            <GenresDisplay genres={book.genres} />
          </div>

          <div className="flex gap-1 shrink mt-1">
            <RateBook isbn={book.isbn} />

            <Tooltip delayDuration={700}>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={pressed}
                  onPressedChange={setPressed}
                  className={`cursor-pointer ${pressed ? "bg-secondary" : ""}`}
                >
                  <MessageCirclePlus />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Leave a review</p>
              </TooltipContent>
            </Tooltip>

            <Toggle
              pressed={openNote}
              onPressedChange={() => handleOpenNote()}
              className="cursor-pointer"
            >
              <FileText />
            </Toggle>

            <AddBookToPicks isbn={book.isbn} />

            <MyReadingStatus isbn={book.isbn} />
          </div>

          <p className="my-6">{book.description}</p>

          <div className="flex flex-row gap-4">
            <Button
              onClick={() => {
                navigate(`/books/edit/${book.isbn}`);
              }}
            >
              Edit Book
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => {
                deleteClickHandler();
              }}
            >
              Delete Book
            </Button>
          </div>
        </div>

        <div className="flex justify-center gap-4">
          <BookStats isbn={book.isbn} />
        </div>
        <div className="row-start-3 col-span-2 flex flex-col overflow-hidden h-full">
          <div className="flex-1 overflow-scroll">
            <CommentsList isbn={book.isbn} createCommentOpen={pressed} />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <CreateNote
          open={openNote}
          setOpen={setOpenNote}
          isbn={book.isbn}
          noteId={currentNote}
        />
        <NotesList
          isbn={book.isbn}
          setOpen={setOpenNote}
          handleEditNote={handleOpenNote}
        />
      </div>
    </div>
  );
}
