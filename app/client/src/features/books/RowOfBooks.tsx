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
    <div className="border rounded-md py-4 flex flex-col">
      <h1 className="ml-4 mb-4 text-xl font-bold">{title}</h1>

      <div className="flex-1 overflow-hidden">
        {books.length > 0 ? (
          <Carousel className="h-full">
            <CarouselContent className="ml-2 mr-4 h-full">
              {books.map((book) => (
                <CarouselItem
                  className="pl-2 basis-auto h-full"
                  key={book.isbn}
                >
                  <SmallBookDisplay book={book} />
                </CarouselItem>
              ))}

              {(() => {
                const val = 9;
                if (books.length >= val) return null;

                const fakes = [];
                for (let i = books.length; i < val; i++) {
                  fakes.push(
                    <CarouselItem className="pl-2 basis-auto h-full" key={i}>
                      <FakeSmallBookDisplay />
                    </CarouselItem>,
                  );
                }
                return fakes;
              })()}
            </CarouselContent>
          </Carousel>
        ) : (
          <div className="flex flex-1 items-center justify-center h-full opacity-50">
            <p>{noBooksMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
