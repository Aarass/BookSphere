import { useGetRecommendedBooksQuery } from "./booksApi";
import { RowOfBooks } from "./RowOfBooks";

export function RecommendedBooksFavorite() {
  const { data: books = [] } = useGetRecommendedBooksQuery("favorite");

  return (
    <RowOfBooks
      books={books}
      title="Books similar to your favorites"
      noBooksMessage="There is nothing to show here"
    />
  );
}
