import { Button } from "@/components/ui/button";
import { Leaderboard } from "@/features/leaderboards/Leaderboard";
import { SearchLeaderboard } from "@/features/leaderboards/SearchLeaderboard";
import { RotateCcw } from "lucide-react";
import { RefObject, useRef } from "react";

export function LeaderboardsPage() {
  const refetch1 = useRef<Function>(null);
  const refetch2 = useRef<Function>(null);

  return (
    <div className="flex-1 self-center grid grid-cols-[min-content_min-content] grid-rows-[min-content_min-content] p-4 gap-8">
      <div className="row-span-2">
        <SearchLeaderboard />
      </div>

      <div className="">
        <div className="flex">
          <h1 className="text-3xl font-bold mb-3">Popular</h1>
          <RefetchButton refetch={refetch2} />
        </div>
        <Leaderboard
          criteria="readers"
          genreId="global"
          setRefetchFunction={(fn) => (refetch2.current = fn)}
        />
      </div>

      <div>
        <div className="flex">
          <h1 className="text-3xl font-bold mb-3">Best Rated</h1>
          <RefetchButton refetch={refetch1} />
        </div>
        <Leaderboard
          criteria="rating"
          genreId="global"
          setRefetchFunction={(fn) => (refetch1.current = fn)}
        />
      </div>
    </div>
  );
}

function RefetchButton({ refetch }: { refetch: RefObject<Function | null> }) {
  return (
    <Button
      variant="ghost"
      onClick={() => {
        if (refetch.current) {
          refetch.current();
        }
      }}
    >
      <RotateCcw />
    </Button>
  );
}
