import { Book } from "@interfaces/book";
import { BookOpen, MessageCircleHeart, Star, Users } from "lucide-react";
import { useGetBookStatsQuery } from "./booksApi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function BookStats({ isbn }: { isbn: Book["isbn"] }) {
  const {
    data: stats,
    isLoading,
    error,
    isUninitialized,
  } = useGetBookStatsQuery(isbn);

  if (isUninitialized) {
    throw new Error(`This should be impossible`);
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error</p>;
  }

  if (stats.length !== 4) {
    throw new Error("Error");
  }

  const [ratingsSum, ratingsCount, commentsCount, readersCount] = stats;
  const rating = (ratingsSum / ratingsCount).toFixed(2);

  return (
    <>
      <Tooltip>
        <TooltipTrigger className="flex items-center">
          <Star />
          <span>{rating}</span>
          <div className="flex items-center opacity-50 ml-1">
            ({ratingsCount} {<Users className="inline" size={15} />})
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Average rating</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger className="flex items-center">
          <MessageCircleHeart />
          <span>{commentsCount}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Number of reviews</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger className="flex items-center">
          <BookOpen />
          <span>{readersCount}</span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Number of people currently reading this book</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
}
