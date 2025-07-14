import { BookClubDisplay } from "./BookClubDisplay";
import { useGetJoinedBookClubsQuery } from "./bookClubsApi";

export function JoinedBookClubs() {
  const {
    data: bookClubs = [],
    isLoading,
    isFetching,
  } = useGetJoinedBookClubsQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      {bookClubs.map((club) => (
        <BookClubDisplay club={club} />
      ))}
    </div>
  );
}
