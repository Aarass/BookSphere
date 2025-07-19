import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Book } from "@interfaces/book";
import { User } from "@interfaces/user";
import { FakeSmallBookDisplay } from "../FakeSmallBookDisplay";
import { SmallBookDisplay } from "../SmallBookDisplay";
import { useGetUserPicksListsQuery } from "./picksApi";

export function UserPicks({
  userId,
  isMe,
}: {
  userId: User["id"];
  isMe: boolean;
}) {
  const { data: lists = [] } = useGetUserPicksListsQuery({
    userId,
    isMe,
  });

  return (
    <div className="flex gap-2">
      {lists.map((list) => (
        <section key={list._id}>
          <h1 className="mb-1 text-xl font-bold">{list.description}</h1>
          <SingleList books={list.books} />
        </section>
      ))}
    </div>
  );
}

export function SingleList({ books }: { books: Book[] }) {
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
          if (books.length >= 2) return null;

          const fakes = [];
          for (let i = books.length; i < 2; i++) {
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
