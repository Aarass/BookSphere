import { useGetBooksQuery } from "./booksApi";
import { SmallBookDisplay } from "./SmallBookDisplay";

export function BookList() {
  const { data: books, isLoading, error, isUninitialized } = useGetBooksQuery();

  if (isUninitialized) {
    throw new Error(`This should be impossible`);
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error</p>;
  }

  return (
    <div className="flex gap-2">
      {books.map((book) => (
        <SmallBookDisplay key={book.isbn} book={book} />
      ))}
    </div>
  );
}

// <div className={`flex gap-2 ${isFetching ? "opacity-50" : ""}`}>
