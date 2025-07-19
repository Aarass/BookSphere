import { Book } from "@interfaces/book";
import { BookStats } from "./BookStats";
import { RateBook } from "./rating/RateBook";
import { MyReadingStatus } from "./MyReadingStatus";
import { CommentsList } from "./comments/CommentsList";
import { Toggle } from "@/components/ui/toggle";
import { useState } from "react";
import { MessageCirclePlus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AddBookToPicks } from "./picks/AddBookToPicks";
import { GenresDisplay } from "./GenresDisplay";

export function BookDisplay({ book }: { book: Book }) {
  const [pressed, setPressed] = useState(false);

  return (
    <div className="flex flex-col items-center h-full">
      <div className="mx-auto flex">
        <div className="ml-auto">
          <img
            src={book.imageUrl}
            className="w-3xs aspect-(--cover) object-center object-cover"
          />
        </div>
        <div className="max-w-md flex flex-col">
          <h1 className="text-2xl font-bold">
            {book.title} - {book.author.fullName}
          </h1>

          <div className="flex flex-wrap mt-1 gap-1">
            <GenresDisplay genres={book.genres} />
          </div>

          <div className="flex gap-4 p-2">
            <BookStats isbn={book.isbn} />
          </div>

          <p className="my-auto">{book.description}</p>

          <div className="flex flex-col gap-1 shrink">
            <RateBook isbn={book.isbn} />
            <div className="flex items-center">
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

              <AddBookToPicks isbn={book.isbn} />

              <MyReadingStatus isbn={book.isbn} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1">
        <div className="w-full">
          <CommentsList isbn={book.isbn} createCommentOpen={pressed} />
        </div>
      </div>
    </div>
  );
}
