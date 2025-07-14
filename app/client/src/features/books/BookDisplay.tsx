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

export function BookDisplay({ book }: { book: Book }) {
  const [pressed, setPressed] = useState(false);

  return (
    <div>
      <img
        src={book.imageUrl}
        className="w-3xs aspect-(--cover) object-center object-cover"
      />
      <p>{`${book.title} - ${book.author.fullName}`}</p>
      <div className="flex gap-1">
        {book.genres.map((genre) => {
          return <span key={genre.id}>{genre.name}</span>;
        })}
      </div>
      <p>{book.description}</p>

      <BookStats isbn={book.isbn} />

      <div className="flex gap-1 items-center">
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
        <MyReadingStatus isbn={book.isbn} />
      </div>

      <CommentsList isbn={book.isbn} createCommentOpen={pressed} />
    </div>
  );
}
