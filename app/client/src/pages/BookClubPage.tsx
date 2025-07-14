import {
  useGetBookClubByIdQuery,
  useJoinBookClubMutation,
  useLeaveBookClubMutation,
} from "@/features/clubs/bookClubsApi";
import { useParams } from "react-router";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookClub } from "@interfaces/bookClub";

export function BookClubPage() {
  let { id } = useParams();
  if (!id) throw "Developer error";

  const { data: club, isLoading } = useGetBookClubByIdQuery(id);
  const [join, { isLoading: joining }] = useJoinBookClubMutation();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!club) {
    return <p>Couldn't fetch information about that club</p>;
  }

  return (
    <div className="w-full h-full grow p-4 flex flex-col">
      <h1 className="text-2xl font-bold">{club.tittle}</h1>
      <p className="opacity-80">{club.description}</p>
      <Separator className="mt-1" />
      {club.isJoined ? (
        <UnlockedContent club={club} />
      ) : (
        <div className="w-full my-auto flex flex-col justify-center items-center relative gap-6">
          <div className="w-xs">
            <Lock size={100} opacity={0.5} className="mx-auto" />
            <p className="text-sm text-center">
              In order to see book club content
              <br /> you need to join it first
            </p>
          </div>

          <Button
            onClick={() => {
              join(id);
            }}
          >
            Join
          </Button>
        </div>
      )}
    </div>
  );
}

function UnlockedContent({ club }: { club: BookClub }) {
  const [leave, { isLoading: leaving }] = useLeaveBookClubMutation();

  return (
    <Button
      variant="destructive"
      onClick={() => {
        leave(club.id);
      }}
    >
      Leave
    </Button>
  );
}
