import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { BookRaw } from "@interfaces/book";
import { SmallBookDisplay } from "./SmallBookDisplay";
import { FakeSmallBookDisplay } from "./FakeSmallBookDisplay";

export function RowOfBooks({
  books,
  title,
  noBooksMessage,
}: {
  books: BookRaw[];
  title: string;
  noBooksMessage: string;
}) {
  return (
    <div className="border rounded-md py-4">
      <h1 className="ml-4 mb-1 text-xl font-bold">{title}</h1>

      {books.length > 0 ? (
        <Carousel className="w-full">
          <CarouselContent className="ml-2 mr-4">
            {books.map((book) => (
              <CarouselItem className="basis-1/6 pl-2" key={book.isbn}>
                <div className="aspect-(--cover) ">
                  <SmallBookDisplay book={book} />
                </div>
              </CarouselItem>
            ))}

            {(() => {
              if (books.length > 6) return null;

              const fakes = [];
              for (let i = books.length; i < 6; i++) {
                fakes.push(
                  <CarouselItem className="basis-1/6 pl-2" key={i}>
                    <FakeSmallBookDisplay />
                  </CarouselItem>,
                );
              }
              return fakes;
            })()}
          </CarouselContent>
        </Carousel>
      ) : (
        <div className="flex flex-1 items-center justify-center h-48 opacity-50">
          <p>{noBooksMessage}</p>
        </div>
      )}
    </div>
  );
}
