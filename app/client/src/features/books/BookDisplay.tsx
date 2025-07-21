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
    <div className="grid grid-cols-[fit-content_fit-content] grid-rows-[auto_min-content_1fr] gap-4 w-fit mx-auto h-full">
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

          <AddBookToPicks isbn={book.isbn} />

          <MyReadingStatus isbn={book.isbn} />
        </div>

        <p className="my-6">{book.description}</p>
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
  );
}
