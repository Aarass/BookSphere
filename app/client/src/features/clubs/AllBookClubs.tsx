import { Separator } from "@/components/ui/separator";
import { BookClubDisplay } from "./BookClubDisplay";
import { useGetAllBookClubsQuery } from "./bookClubsApi";

export function AllBookClubs() {
  const {
    data: bookClubs = [],
    isLoading,
    isFetching,
  } = useGetAllBookClubsQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <Separator />
      {bookClubs.map((club) => (
        <>
          <div className="p-4">
            <BookClubDisplay club={club} />
          </div>
          <Separator />
        </>
      ))}
    </div>
  );
}
