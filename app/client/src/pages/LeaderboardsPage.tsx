import { Button } from "@/components/ui/button";
import { Leaderboard } from "@/features/leaderboards/Leaderboard";
import { SearchLeaderboard } from "@/features/leaderboards/SearchLeaderboard";
import { Glasses, RotateCcw, Sparkles } from "lucide-react";
import { RefObject, useRef } from "react";

export function LeaderboardsPage() {
  const refetch1 = useRef<Function>(null);
  const refetch2 = useRef<Function>(null);

  return (
    <>
      <div className="flex gap-28">
        <div>
          <div className="flex">
            <h1 className="text-3xl font-bold mb-3">Best Rated</h1>
            <RefetchButton refetch={refetch1} />
          </div>
          <Leaderboard
            criteria="rating"
            genreId="global"
            scoreIcon={<Sparkles className="mr-1" size={20} />}
            setRefetchFunction={(fn) => (refetch1.current = fn)}
          />
        </div>

        <div className="">
          <div className="flex">
            <h1 className="text-3xl font-bold mb-3">Popular</h1>
            <RefetchButton refetch={refetch2} />
          </div>
          <Leaderboard
            criteria="readers"
            genreId="global"
            scoreIcon={<Glasses className="mr-1" size={20} />}
            setRefetchFunction={(fn) => (refetch2.current = fn)}
          />
        </div>
      </div>
      <SearchLeaderboard />
    </>
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
