import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { BookRaw } from "@interfaces/book";
import { User } from "@interfaces/user";
import { FakeSmallBookDisplay } from "./FakeSmallBookDisplay";
import { SmallBookDisplay } from "./SmallBookDisplay";

export function UserPicks({ userId }: { userId: User["id"] }) {
  const books: BookRaw[] = [];

  return (
    <Carousel
      opts={{
        align: "start",
      }}
      orientation="vertical"
      className="w-50 h-full"
    >
      <CarouselContent className="-mt-1 h-full">
        {books.map((book) => (
          <CarouselItem
            className="basis-2/5 aspect-(--cover) pt-2"
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
              <CarouselItem className="basis-2/5 pt-2" key={i}>
                <FakeSmallBookDisplay />
              </CarouselItem>,
            );
          }
          return fakes;
        })()}
      </CarouselContent>
    </Carousel>
  );
}
