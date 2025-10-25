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
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-2 p-4">
      {books.map((book) => (
        <SmallBookDisplay book={book} key={book.isbn} />
      ))}
      <Button className="w-full h-auto aspect-(--cover) p-0 m-0" asChild>
        <Link to="/books/create">
          <Plus />
        </Link>
      </Button>
    </div>
  );
}

// <div className={`flex gap-2 ${isFetching ? "opacity-50" : ""}`}>
