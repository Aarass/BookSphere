import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { User } from "@interfaces/user";
import { useGetCompletedBooksQuery } from "./booksApi";
import { FakeSmallBookDisplay } from "./FakeSmallBookDisplay";
import { SmallBookDisplay } from "./SmallBookDisplay";

export function ReadBooks({ userId }: { userId: User["id"] }) {
  const { data: books = [] } = useGetCompletedBooksQuery(userId);

  return (
    <div>
      <Carousel>
        <CarouselContent className="-ml-2">
          {books.map((book) => (
            <CarouselItem className="basis-1/3 pl-2" key={book.isbn}>
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
