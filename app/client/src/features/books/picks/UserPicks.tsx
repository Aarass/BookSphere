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
        <section
          key={list._id}
          className="w-40 h-full flex flex-col overflow-hidden"
        >
          <h1 className="mb-1 text-xl font-bold truncate">
            {list.description}
          </h1>
          <div className="flex-1 overflow-hidden">
            <SingleList books={list.books} />
          </div>
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
      className="h-full w-full"
    >
      <CarouselContent className="-mt-1 h-full">
        {[
          ...books,
          ...Array.from({ length: Math.max(0, 2 - books.length) }, () => null),
        ].map((book, index) => (
          <CarouselItem
            className="pt-1 w-full basis-auto "
            key={book ? book.isbn : index}
          >
            {book ? <SmallBookDisplay book={book} /> : <FakeSmallBookDisplay />}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
