import { useParams } from "react-router";
import { BookDisplay } from "./BookDisplay";
import { useGetBookQuery } from "./booksApi";

export function Book() {
  let { isbn } = useParams();

  const {
    data: book,
    isUninitialized,
    isLoading,
    error,
  } = useGetBookQuery(isbn!, { skip: isbn === undefined });

  if (isUninitialized) {
    return <p>There is no id in the url</p>;
  }

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>There was an error</p>;
  }

  return <BookDisplay book={book} />;
}
