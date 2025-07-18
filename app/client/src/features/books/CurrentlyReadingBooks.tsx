import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { User } from "@interfaces/user";
import { useGetCurrentlyReadingBooksQuery } from "./booksApi";
import { FakeSmallBookDisplay } from "./FakeSmallBookDisplay";
import { SmallBookDisplay } from "./SmallBookDisplay";

export function CurrentlyReadingBooks({ userId }: { userId: User["id"] }) {
  const { data: books = [] } = useGetCurrentlyReadingBooksQuery(userId);

  return (
    <div>
      <Carousel>
        <CarouselContent className="-ml-2">
          {books.map((book) => (
            <CarouselItem
              className="basis-1/3 aspect-(--cover) pl-2"
              key={book.isbn}
            >
              <div className="w-full h-full">
                <SmallBookDisplay book={book} />
              </div>
            </CarouselItem>
          ))}
          {(() => {
            if (books.length > 3) return null;

            const fakes = [];
            for (let i = books.length; i < 3; i++) {
              fakes.push(
                <CarouselItem className="basis-1/3 pl-2" key={i}>
                  <div className="w-full h-full">
                    <FakeSmallBookDisplay />
                  </div>
                </CarouselItem>,
              );
            }
            return fakes;
          })()}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
