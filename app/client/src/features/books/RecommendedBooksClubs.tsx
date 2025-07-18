import { useGetRecommendedBooksQuery } from "./booksApi";
import { RowOfBooks } from "./RowOfBooks";

export function RecommendedBooksClubs() {
  const { data: books = [] } = useGetRecommendedBooksQuery("clubs");

  return (
    <RowOfBooks
      books={books}
      title="Popular in your book clubs"
      noBooksMessage="There is nothing to show here"
    />
  );
}
