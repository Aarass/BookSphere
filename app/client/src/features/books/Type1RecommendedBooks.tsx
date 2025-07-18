import { useGetRecommendedBooksQuery } from "./booksApi";
import { RowOfBooks } from "./RowOfBooks";

export function Type1RecommendedBooks() {
  const { data: books = [] } = useGetRecommendedBooksQuery();

  return <RowOfBooks books={books} title="Recommended books" />;
}
