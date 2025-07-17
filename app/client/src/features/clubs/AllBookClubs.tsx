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
      {bookClubs.map((club) => (
        <BookClubDisplay club={club} key={club.id} />
      ))}
    </div>
  );
}
