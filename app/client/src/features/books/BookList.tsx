import { Button } from "@/components/ui/button";
import { useGetBooksQuery } from "./booksApi";
import { SmallBookDisplay } from "./SmallBookDisplay";
import { Plus } from "lucide-react";
import { Link } from "react-router";

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
    <div className="flex flex-wrap gap-2 p-2">
      <Button className="h-52 aspect-(--cover) p-0 m-0" asChild>
        <Link to="/books/create">
          <Plus />
        </Link>
      </Button>
      {books.map((book) => (
        <div className="h-52">
          <SmallBookDisplay key={book.isbn} book={book} />
        </div>
      ))}
    </div>
  );
}

// <div className={`flex gap-2 ${isFetching ? "opacity-50" : ""}`}>
