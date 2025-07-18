import { useGetRecommendedBooksQuery } from "./booksApi";
import { RowOfBooks } from "./RowOfBooks";

export function RecommendedBooksGenres() {
  const { data: books = [] } = useGetRecommendedBooksQuery("genres");

  return (
    <RowOfBooks
      books={books}
      title="Top Picks Based on Your Favorite Genres"
      noBooksMessage="There is nothing to show here"
    />
  );
}
