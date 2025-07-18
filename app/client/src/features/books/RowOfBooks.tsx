import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { BookRaw } from "@interfaces/book";
import { SmallBookDisplay } from "./SmallBookDisplay";

export function RowOfBooks({
  books,
  title,
}: {
  books: BookRaw[];
  title: string;
}) {
  return (
    <div className="border rounded-md py-4">
      <h1 className="ml-4 mb-1 text-xl font-bold">{title}</h1>
      <Carousel>
        <CarouselContent className="ml-2 h-48">
          {books.map((book) => (
            <CarouselItem className="basis-1/3 pl-2" key={book.isbn}>
              <SmallBookDisplay book={book} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
