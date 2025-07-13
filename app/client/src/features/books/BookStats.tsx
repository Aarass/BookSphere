import { Book } from "@interfaces/book";
import { BookOpen, MessageCircleHeart, Star } from "lucide-react";
import { useGetBookStatsQuery } from "./booksApi";

export function BookStats({ isbn }: { isbn: Book["isbn"] }) {
  const {
    data: stats,
    isLoading,
    error,
    isUninitialized,
  } = useGetBookStatsQuery(isbn);

  console.log(stats);

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
    <div className="flex gap-2">
      <Star />
      <span>{rating}</span>
      <span>({ratingsCount})</span>
      <MessageCircleHeart />
      <span>{commentsCount}</span>
      <BookOpen />
      <span>{readersCount}</span>
    </div>
  );
}
