import { Book } from "@interfaces/book";
import { BookStats } from "./BookStats";
import { RateBook } from "./rating/RateBook";
import { MyReadingStatus } from "./MyReadingStatus";
import { CommentsList } from "./comments/CommentsList";

export function BookDisplay({ book }: { book: Book }) {
  return (
    <div>
      <img
        src={book.imageUrl}
        className="w-3xs aspect-(--cover) object-center object-cover"
      />
      <p>{`${book.title} - ${book.author.fullName}`}</p>
      <div className="flex gap-1">
        {book.genres.map((genre) => {
          return <span key={genre.id}>{genre.name}</span>;
        })}
      </div>
      <p>{book.description}</p>

      <BookStats isbn={book.isbn} />
      <div className="flex items-center">
        <RateBook isbn={book.isbn} />
        <MyReadingStatus isbn={book.isbn} />
      </div>

      <CommentsList isbn={book.isbn} />
    </div>
  );
}
