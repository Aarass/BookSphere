import { useGetBooksQuery } from "./booksApi";

export function BookList() {
  const { data: books, isLoading, error } = useGetBooksQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  } else {
    return books!.map((book) => (
      <p>{JSON.stringify({ ...book, imageUrl: undefined })}</p>
    ));
  }
}
