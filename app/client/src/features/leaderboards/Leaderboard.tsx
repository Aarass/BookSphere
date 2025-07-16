import { Glasses, Hash, Sparkles } from "lucide-react";
import { ReactNode, useEffect } from "react";
import { NavLink } from "react-router";
import { useGetLeaderboardQuery } from "./leaderboardsApi";

type ExtractObject<T> = T extends object ? T : never;
type Args = ExtractObject<Parameters<typeof useGetLeaderboardQuery>[0]>;

export function Leaderboard({
  criteria,
  genreId,
  setRefetchFunction,
}: {
  scoreIcon: ReactNode;
  criteria: Args["criteria"];
  genreId: Args["genreId"];
  setRefetchFunction?: ((_: Function) => void) | undefined;
}) {
  const {
    data: books = [],
    isLoading,
    refetch,
  } = useGetLeaderboardQuery({
    criteria,
    genreId,
  });

  useEffect(() => {
    setTimeout(() => {
      if (setRefetchFunction) {
        setRefetchFunction(refetch);
      }
    }, 1000);
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="grid grid-cols-[repeat(5,_max-content)] gap-y-2">
      {books.map((book, index) => (
        <div
          className="col-span-6 grid grid-cols-subgrid items-center"
          key={book.isbn}
        >
          <Hash size={20} />
          <p>{index + 1}</p>
          <NavLink to={`/books/${book.isbn}`} className="mx-2 underline">
            {book.title}
          </NavLink>
          {criteria === "readers" ? <Glasses /> : <Sparkles />}
          <p className="ml-2">
            {criteria === "readers" ? book.score : book.score.toFixed(1)}
          </p>
        </div>
      ))}
    </div>
  );
}
