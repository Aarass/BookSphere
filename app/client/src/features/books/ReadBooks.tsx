import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { User } from "@interfaces/user";
import { useGetCompletedBooksQuery } from "./booksApi";
import { SmallBookDisplay } from "./SmallBookDisplay";
import { FakeSmallBookDisplay } from "./FakeSmallBookDisplay";

export function ReadBooks({ userId }: { userId: User["id"] }) {
  const { data: books = [] } = useGetCompletedBooksQuery(userId);

  return (
    <div>
      <Carousel className="w-xs">
        <CarouselContent className="-ml-2">
          {books.map((book) => (
            <CarouselItem
              className="basis-1/3 aspect-(--cover) pl-2"
              key={book.isbn}
            >
              <SmallBookDisplay book={book} />
            </CarouselItem>
          ))}
          {(() => {
            if (books.length > 3) return null;

            const fakes = [];
            for (let i = books.length; i < 3; i++) {
              fakes.push(
                <CarouselItem className="basis-1/3 pl-2" key={i}>
                  <FakeSmallBookDisplay />
                </CarouselItem>,
              );
            }
            return fakes;
          })()}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
