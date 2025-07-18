import { User } from "@interfaces/user";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useGetCurrentlyReadingBooksQuery } from "./booksApi";
import { SmallBookDisplay } from "./SmallBookDisplay";

export function CurrentlyReadingBooks({ userId }: { userId: User["id"] }) {
  const { data: books = [] } = useGetCurrentlyReadingBooksQuery(userId);

  return (
    <div>
      <Carousel>
        <CarouselContent className="-ml-2 h-48">
          {books.map((book) => (
            <CarouselItem className="basis-1/3 pl-2" key={book.isbn}>
              <SmallBookDisplay book={book} />
            </CarouselItem>
          ))}
          {(() => {
            if (books.length > 3) return null;

            const fakes = [];
            for (let i = books.length; i < 3; i++) {
              fakes.push(
                <CarouselItem className="basis-1/3 pl-2" key={i}>
                  <div key={i} className="aspect-(--cover) bg-secondary"></div>
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
