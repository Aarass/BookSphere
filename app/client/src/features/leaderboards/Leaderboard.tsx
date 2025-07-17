import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw } from "lucide-react";
import { Link } from "react-router";
import { useGetLeaderboardQuery } from "./leaderboardsApi";

type ExtractObject<T> = T extends object ? T : never;
type Args = ExtractObject<Parameters<typeof useGetLeaderboardQuery>[0]>;

export function Leaderboard({
  criteria,
  genreId,
  title,
}: {
  criteria: Args["criteria"];
  genreId: Args["genreId"];
  title: string;
}) {
  const {
    data: books = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetLeaderboardQuery({
    criteria,
    genreId,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col border rounded-md h-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">
              {criteria === "readers" ? "Readers" : "Average score"}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book, index) => (
            <TableRow className="relative" key={book.isbn}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>{book.title}</TableCell>
              <TableCell className="text-right">
                {criteria === "readers" ? book.score : book.score.toFixed(1)}
              </TableCell>
              <td>
                <Link to={`/books/${book.isbn}`} className="absolute inset-0" />
              </td>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-auto flex pl-2 justify-between items-center">
        <h1 className="text-sm font-bold">{title}</h1>
        <Button variant="ghost" onClick={refetch}>
          <RefreshCw className={isFetching ? "animate-spin" : ""} />
        </Button>
      </div>
    </div>
  );
}
// className="animate-spin"
